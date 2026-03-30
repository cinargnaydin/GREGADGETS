import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

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
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_RECEIVER_EMAIL;

  if (!resendKey || !toEmail) {
    return NextResponse.json({ ok: true, fallback: true });
  }

  const resend = new Resend(resendKey);
  try {
    await resend.emails.send({
      from: "Greenwich Gadgets <onboarding@resend.dev>",
      to: toEmail,
      subject: `New quote request - ${safeName}`,
      text: `Name: ${safeName}\nPhone: ${phone}\nDevice: ${safeDevice}\nIssue: ${issue}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email send failed." }, { status: 500 });
  }
}
