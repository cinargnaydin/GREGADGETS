import { NextResponse } from 'next/server';
import { getOptionalSupabaseAdmin, PG_EXCLUSION_VIOLATION } from '@/lib/supabase/supabase-admin';
import { createDevAppointment, hasDevAppointmentConflict } from '@/lib/dev-store';
import { createCalendarEvent, deleteCalendarEvent, getBusySlots } from '@/lib/google-calendar';
import { updateLead } from '@/lib/leads';
import { shouldSendRealNotifications } from '@/lib/notifications';
import { sendSMS } from '@/lib/sms';
import { Resend } from 'resend';
import { isBefore } from 'date-fns';
import { z } from 'zod';
import {
  isValidDateStr,
  isValidTimeStr,
  resolveWorkingWindow,
  timeToMinutes,
  zonedWallClockToUtc,
} from '@/lib/schedule';

const APPOINTMENT_DURATION_MINUTES = 60;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Greenwich Gadgets <onboarding@resend.dev>';
const bookingNotificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

// Thrown when the slot is taken during the atomic re-check; mapped to a 409.
class SlotConflictError extends Error {}

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  issue: z.string().optional(),
  leadId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:mm'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.issues }, { status: 400 });
    }

    const { name, email, phone, issue, leadId, date, time } = result.data;

    // Defensive re-validation (schema already covers this, keeps the helpers honest)
    if (!isValidDateStr(date) || !isValidTimeStr(time)) {
      return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 });
    }

    // Construct start/end as absolute instants in the shop's timezone (not the host's)
    const startTime = zonedWallClockToUtc(date, time);
    const endTime = new Date(startTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);

    if (isBefore(startTime, new Date())) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 });
    }

    // Enforce business hours / closed days on the server (not just in the slot list)
    const window = await resolveWorkingWindow(date);
    if (window.isClosed) {
      return NextResponse.json({ error: 'We are closed on this date.' }, { status: 409 });
    }
    const requestedMinutes = timeToMinutes(time);
    const openMinutes = timeToMinutes(window.startTime);
    const closeMinutes = timeToMinutes(window.endTime);
    if (requestedMinutes < openMinutes || requestedMinutes + APPOINTMENT_DURATION_MINUTES > closeMinutes) {
      return NextResponse.json({ error: 'Selected time is outside our opening hours.' }, { status: 409 });
    }

    const supabase = getOptionalSupabaseAdmin();

    // Check external calendar availability before we commit anything
    const busySlots = await getBusySlots(startTime.toISOString(), endTime.toISOString());
    const gCalConflict = busySlots.some((busy: { start?: string | null; end?: string | null }) => {
      if (!busy.start || !busy.end) return false;
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return startTime < busyEnd && endTime > busyStart;
    });
    if (gCalConflict) {
      return NextResponse.json({ error: 'Time slot is no longer available in calendar.' }, { status: 409 });
    }

    // Persist the appointment FIRST, then attach the calendar event. This
    // ordering means a failed DB write can never leave an orphaned calendar
    // event. Double-booking is prevented atomically by the Postgres exclusion
    // constraint (overlapping range -> 23P01 -> mapped to a 409).
    let appointmentId: string;

    if (supabase) {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          name,
          email,
          phone,
          ...(issue ? { issue } : {}),
          ...(leadId ? { lead_id: leadId } : {}),
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          calendar_event_id: null,
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === PG_EXCLUSION_VIOLATION) throw new SlotConflictError();
        throw error;
      }
      appointmentId = String(data.id);
    } else {
      if (hasDevAppointmentConflict(startTime, endTime)) {
        return NextResponse.json({ error: 'Time slot is no longer available.' }, { status: 409 });
      }
      const appointment = createDevAppointment({
        name,
        email,
        phone,
        ...(issue ? { issue } : {}),
        ...(leadId ? { leadId } : {}),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        calendarEventId: null,
      });
      appointmentId = appointment.id;
    }

    // Attach a calendar event (best-effort; never throws — returns null on failure)
    const eventSummary = issue ? `Appointment: ${issue} - ${name}` : `Appointment: ${name}`;
    const eventDesc = [
      issue ? `Issue: ${issue}` : null,
      leadId ? `Lead ID: ${leadId}` : null,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
    ].filter(Boolean).join('\n');

    let calendarEventId: string | null = null;
    try {
      const calendarEvent = await createCalendarEvent(
        startTime.toISOString(),
        endTime.toISOString(),
        eventSummary,
        eventDesc
      );
      calendarEventId = calendarEvent?.id || null;
      if (calendarEventId && supabase) {
        await supabase
          .from('appointments')
          .update({ calendar_event_id: calendarEventId })
          .eq('id', appointmentId);
      }
    } catch (calendarError) {
      // If linking the event to the appointment failed, remove the stray event.
      console.error('Error attaching calendar event:', calendarError);
      if (calendarEventId) await deleteCalendarEvent(calendarEventId);
      calendarEventId = null;
    }

    // Send confirmations asynchronously (fire-and-forget)
    const timeFormatted = `${time} on ${date}`;
    const sendRealNotifications = shouldSendRealNotifications();

    if (sendRealNotifications && process.env.TWILIO_ACCOUNT_SID) {
      sendSMS(phone, `Hi ${name}, your ${issue ? `${issue} ` : ''}appointment is confirmed for ${timeFormatted}.`).catch(console.error);
    }

    if (sendRealNotifications && resend) {
      resend.emails.send({
        from: resendFromEmail,
        to: email,
        subject: 'Appointment Confirmed',
        text: `Hi ${name},\n\nYour ${issue ? `${issue} ` : ''}appointment is confirmed for ${timeFormatted}.\n\nThank you!`,
      }).catch(console.error);

      if (bookingNotificationEmail) {
        resend.emails.send({
          from: resendFromEmail,
          to: bookingNotificationEmail,
          subject: `New repair booking - ${name} - ${timeFormatted}`,
          text: [
            'New repair booking received.',
            '',
            `Appointment ID: ${appointmentId}`,
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            ...(issue ? [`Issue: ${issue}`] : []),
            ...(leadId ? [`Lead ID: ${leadId}`] : []),
            `Date: ${date}`,
            `Time: ${time}`,
            `Calendar Event ID: ${calendarEventId || 'Not created'}`,
          ].join('\n'),
        }).catch(console.error);
      }
    }

    if (leadId) {
      updateLead(leadId, {
        stage: 'booked',
        preferredContact: 'booking',
        appointmentId,
      }).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      appointmentId,
      fallback: !supabase,
      notifications: sendRealNotifications ? 'sent-if-configured' : 'preview-only',
    });

  } catch (error: unknown) {
    if (error instanceof SlotConflictError) {
      return NextResponse.json({ error: 'Time slot is no longer available.' }, { status: 409 });
    }
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
