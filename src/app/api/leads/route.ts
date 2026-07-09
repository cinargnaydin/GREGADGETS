import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  createLead,
  LEAD_PREFERRED_CONTACTS,
  LEAD_STAGES,
  LEAD_TYPES,
  LEAD_URGENCIES,
  updateLead,
  type LeadRecord,
} from '@/lib/leads';
import { shouldSendRealNotifications } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

const leadSchema = z.object({
  type: z.enum(LEAD_TYPES).default('repair'),
  sourcePage: z.string().optional(),
  sourceUrl: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().min(8),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  issue: z.string().min(2),
  device: z.string().optional(),
  urgency: z.enum(LEAD_URGENCIES),
  preferredContact: z.enum(LEAD_PREFERRED_CONTACTS).optional(),
  consent: z.boolean(),
  utm: z.record(z.string(), z.string()).optional(),
});

const leadUpdateSchema = z.object({
  id: z.string().min(1),
  stage: z.enum(LEAD_STAGES).optional(),
  preferredContact: z.enum(LEAD_PREFERRED_CONTACTS).optional(),
  appointmentId: z.string().optional(),
  notes: z.string().optional(),
});

// Prevents a slow/hanging Resend request from stalling the API response.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Notification email timed out')), ms)
    ),
  ]);
}

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.consent) {
    return NextResponse.json({ error: 'Invalid lead payload.' }, { status: 400 });
  }

  try {
    const lead = await createLead(parsed.data);
    const notificationSent = await sendLeadNotification(lead);

    return NextResponse.json({
      ok: true,
      lead,
      fallback: lead.storage === 'memory',
      notificationSent,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Lead creation failed.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const parsed = leadUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead update payload.' }, { status: 400 });
  }

  try {
    const { id, ...update } = parsed.data;
    const lead = await updateLead(id, update);
    return NextResponse.json({ ok: true, lead, fallback: lead.storage === 'memory' });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Lead update failed.' }, { status: 500 });
  }
}

async function sendLeadNotification(lead: LeadRecord) {
  if (!shouldSendRealNotifications()) return false;

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.LEAD_NOTIFICATION_EMAIL ||
    process.env.QUOTE_RECEIVER_EMAIL ||
    process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!resendKey || !toEmail) return false;

  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM_EMAIL || 'Greenwich Gadgets <onboarding@resend.dev>';

  try {
    await withTimeout(resend.emails.send({
      from,
      to: toEmail,
      subject: `New website lead - ${lead.issue}`,
      text: [
        'New lead received.',
        '',
        `Lead ID: ${lead.id}`,
        `Type: ${lead.type}`,
        `Stage: ${lead.stage}`,
        `Name: ${lead.name || 'Not provided'}`,
        `Phone: ${lead.phone}`,
        `Email: ${lead.email || 'Not provided'}`,
        `Issue: ${lead.issue}`,
        `Device: ${lead.device || 'Not provided'}`,
        `Urgency: ${lead.urgency}`,
        `Preferred Contact: ${lead.preferredContact}`,
        `Source Page: ${lead.sourcePage || 'Not provided'}`,
        `Source URL: ${lead.sourceUrl || 'Not provided'}`,
      ].join('\n'),
    }), 8000);
    return true;
  } catch (error) {
    console.error('Lead notification failed:', error);
    return false;
  }
}
