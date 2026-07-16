'use server';

import { Resend } from 'resend';

// Booking requests are emailed straight to the shop's inbox via Resend.
// No database, no calendar, no third-party booking backend — just an email.
//
// The shop only wants four things from the customer:
//   1. Phone number  2. Phone brand  3. What's broken  4. The day they want it fixed
//
// Only RESEND_API_KEY needs to be set for this to work. The from/to addresses
// default to the values the shop provided but can be overridden via env if needed.
const FROM_EMAIL =
  process.env.BOOKING_FROM_EMAIL || 'Greenwich Gadgets <noreply@greenwichgadgets.com>';
const TO_EMAIL = process.env.BOOKING_TO_EMAIL || 'greenwichgadgets@gmail.com';

export type BookingState = {
  ok: boolean;
  message: string;
  // Field-level errors keyed by input name, used to highlight the form.
  errors?: Partial<Record<'phone' | 'brand' | 'issue' | 'day', string>>;
};

function clean(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

// Turn a "YYYY-MM-DD" date-input value into "Monday, 20 July 2026".
// Parsed from parts to avoid UTC/local off-by-one shifts. Falls back to the raw value.
function formatDay(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(date.getTime())) return value;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const phone = clean(formData.get('phone'));
  const brand = clean(formData.get('brand'));
  const issue = clean(formData.get('issue'));
  const day = clean(formData.get('day'));
  // Device type ("Phone" or "Laptop") comes from the booking form's toggle.
  const device = clean(formData.get('device')) || 'Phone';

  // Server-side validation of the four required fields.
  const errors: BookingState['errors'] = {};
  if (!phone) errors.phone = 'Please enter a phone number so we can reach you.';
  if (!brand) errors.brand = 'Please tell us the phone brand.';
  if (!issue) errors.issue = 'Please tell us what needs fixing.';
  if (!day) errors.day = 'Please choose a day you would like it fixed.';

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: 'Please complete the highlighted fields.', errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // The key is set after deploy; fail loudly in logs but gently to the customer.
    console.error('RESEND_API_KEY is not set — cannot send booking email.');
    return {
      ok: false,
      message:
        'Sorry, we could not submit your request right now. Please call or WhatsApp us instead.',
    };
  }

  const resend = new Resend(apiKey);

  const prettyDay = formatDay(day);
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const subject = `New ${device.toLowerCase()} repair request — ${brand} (${issue})`;

  const rows: Array<[string, string]> = [
    ['Phone number', phone],
    ['Device type', device],
    [`${device} brand`, brand],
    ["What's broken", issue],
    ['Preferred day', prettyDay],
  ];

  const text = [
    'NEW REPAIR REQUEST',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Sent from the Greenwich Gadgets booking form.',
  ].join('\n');

  // Email-client-safe HTML: table layout + inline styles only. Brand red #cb1e27.
  const rowsHtml = rows
    .map(
      ([label, value], i) => `
              <tr>
                <td style="padding:14px 24px;border-top:${
                  i === 0 ? 'none' : '1px solid #eeeeee'
                };font-family:Arial,Helvetica,sans-serif;">
                  <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9a9a;margin-bottom:4px;">${escapeHtml(
                    label
                  )}</div>
                  <div style="font-size:17px;font-weight:bold;color:#111111;">${escapeHtml(
                    value
                  )}</div>
                </td>
              </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:#cb1e27;padding:28px 24px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:-0.01em;">Greenwich Gadgets</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#ffd9db;margin-top:4px;">New repair request</div>
            </td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:24px 24px 4px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#444444;line-height:1.5;">
              A customer just submitted a repair request through the website. Here are the details:
            </td>
          </tr>
          <!-- Details card -->
          <tr>
            <td style="padding:16px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:12px;overflow:hidden;">
                ${rowsHtml}
              </table>
            </td>
          </tr>
          <!-- Call button -->
          <tr>
            <td align="center" style="padding:8px 24px 28px 24px;">
              <a href="${escapeHtml(telHref)}" style="display:inline-block;background-color:#cb1e27;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:10px;">Call ${escapeHtml(
                phone
              )}</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:18px 24px;border-top:1px solid #eeeeee;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9a9a9a;line-height:1.5;">
              Sent automatically from the Greenwich Gadgets online booking form.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend failed to send booking email:', error);
      return {
        ok: false,
        message:
          'Sorry, something went wrong sending your request. Please call or WhatsApp us instead.',
      };
    }
  } catch (err) {
    console.error('Unexpected error sending booking email:', err);
    return {
      ok: false,
      message:
        'Sorry, something went wrong sending your request. Please call or WhatsApp us instead.',
    };
  }

  return {
    ok: true,
    message: "Thanks! We've received your request and will be in touch to confirm.",
  };
}
