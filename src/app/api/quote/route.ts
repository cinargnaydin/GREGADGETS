import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createLead } from "@/lib/leads";
import { shouldSendRealNotifications } from "@/lib/notifications";

const quoteSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(8),
  device: z.string().optional(),
  issue: z.string().min(8),
  consent: z.boolean(),
});

export async function POST(request: Request) {
  const parsed = quoteSchema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.consent) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { name, phone, device, issue } = parsed.data;
  const safeName = name?.trim() || "Website Lead";
  const safeDevice = device?.trim() || "Not provided";

  // Persist the lead first. If this fails, nothing was captured, so a 500 (which
  // prompts the user to retry) is the correct response.
  let lead;
  try {
    lead = await createLead({
      type: "repair",
      sourcePage: "quote_form",
      name: safeName,
      phone,
      device: safeDevice,
      issue,
      urgency: "flexible",
      preferredContact: "phone",
      consent: true,
    });
  } catch (error) {
    console.error("Quote lead creation failed:", error);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_RECEIVER_EMAIL;

  if (!resendKey || !toEmail || !shouldSendRealNotifications()) {
    return NextResponse.json({
      ok: true,
      fallback: lead.storage === "memory",
      leadId: lead.id,
      storage: lead.storage,
      notifications: "preview-only",
    });
  }

  // The lead is already saved. A notification-email failure must NOT return 500,
  // otherwise the user resubmits and we create duplicate leads. Log it and still
  // report success, because the customer's request was captured.
  const resend = new Resend(resendKey);
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Greenwich Gadgets <onboarding@resend.dev>",
      to: toEmail,
      subject: `New quote request - ${safeName}`,
      text: `Name: ${safeName}\nPhone: ${phone}\nDevice: ${safeDevice}\nIssue: ${issue}`,
    });
    return NextResponse.json({
      ok: true,
      fallback: lead.storage === "memory",
      leadId: lead.id,
      storage: lead.storage,
      notifications: "sent",
    });
  } catch (error) {
    console.error("Quote notification email failed:", error);
    return NextResponse.json({
      ok: true,
      fallback: lead.storage === "memory",
      leadId: lead.id,
      storage: lead.storage,
      notifications: "failed",
    });
  }
}
