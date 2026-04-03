import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { createCalendarEvent, getBusySlots } from '@/lib/google-calendar';
import { sendSMS } from '@/lib/sms';
import { Resend } from 'resend';
import { parseISO, addMinutes, isBefore } from 'date-fns';
import { z } from 'zod';

const APPOINTMENT_DURATION_MINUTES = 60;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:mm
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.issues }, { status: 400 });
    }

    const { name, email, phone, date, time } = result.data;

    // Construct start and end times
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = parseISO(date);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = addMinutes(startTime, APPOINTMENT_DURATION_MINUTES);

    if (isBefore(startTime, new Date())) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 });
    }

    // Double check availability to prevent race conditions
    // 1. Check Firestore
    const conflictsSnapshot = await adminDb.collection('appointments')
      .where('startTime', '<', endTime)
      .where('endTime', '>', startTime)
      .get();
      
    if (!conflictsSnapshot.empty) {
      return NextResponse.json({ error: 'Time slot is no longer available.' }, { status: 409 });
    }

    // 2. Check GCal
    const busySlots = await getBusySlots(startTime.toISOString(), endTime.toISOString());
    const gCalConflict = busySlots.some((busy: any) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return (startTime < busyEnd && endTime > busyStart);
    });

    if (gCalConflict) {
       return NextResponse.json({ error: 'Time slot is no longer available in calendar.' }, { status: 409 });
    }

    // Add to Google Calendar
    const eventSummary = `Appointment: ${name}`;
    const eventDesc = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`;
    const calendarEvent = await createCalendarEvent(
      startTime.toISOString(),
      endTime.toISOString(),
      eventSummary,
      eventDesc
    );

    // Save to Firestore
    const docRef = await adminDb.collection('appointments').add({
      name,
      email,
      phone,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      calendarEventId: calendarEvent?.id || null,
      createdAt: new Date(),
    });

    // Send Confirmations Asynchronously
    const timeFormatted = `${time} on ${date}`;
    
    // Send SMS
    if (process.env.TWILIO_ACCOUNT_SID) {
      sendSMS(phone, `Hi ${name}, your appointment is confirmed for ${timeFormatted}.`).catch(console.error);
    }

    // Send Email
    if (resend) {
      resend.emails.send({
        from: 'onboarding@resend.dev', // Default resend testing email
        to: email, // If using free resend, will only work with the verified email unless domain is verified
        subject: 'Appointment Confirmed',
        html: `<p>Hi ${name},</p><p>Your appointment is confirmed for <strong>${timeFormatted}</strong>.</p><p>Thank you!</p>`
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, appointmentId: docRef.id });

  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
