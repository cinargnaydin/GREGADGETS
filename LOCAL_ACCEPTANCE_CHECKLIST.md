# Greenwich Gadgets Local Acceptance Checklist

Use this before domain/DNS handover. The goal is to prove the website and booking operations locally on `http://localhost:3000`.

## Local Demo Mode

- Run `npm.cmd run dev`.
- Open `http://localhost:3000`.
- There is no admin panel for this website.
- Without `GOOGLE_CALENDAR_ID`, appointment submissions use in-memory local storage. They reset when the dev server restarts.
- In development, real email/SMS sending is off unless `SEND_REAL_NOTIFICATIONS=true`.

## Must Pass Locally

- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- Public routes return 200:
  - `/`
  - `/repair-services`
  - `/buy-sell`
  - `/shop`
  - `/about`
  - `/contact`
  - `/faq`
  - `/book`
- Booking page shows available time slots.
- Booking submission returns success from `/api/appointments/book`.
- A booked local memory slot disappears from later availability results.
- Contact and Repair Services pages show phone/WhatsApp CTAs (no quote form).
- `/get-started` permanently redirects to `/book`.
- Call, WhatsApp, and Directions links open the expected targets.

## Real Service Checks

These require accounts/credentials:

- Resend: booking confirmation and owner notification emails arrive.
- Set `SEND_REAL_NOTIFICATIONS=true` before testing real email/SMS delivery locally.
- Google Calendar (the booking backend): with `GOOGLE_CALENDAR_ID` + `GOOGLE_CALENDAR_CLIENT_EMAIL` + `GOOGLE_CALENDAR_PRIVATE_KEY` set, a booking creates a timed calendar event, and that slot then disappears for the next visitor.
- Google Calendar closures: an all-day "CLOSED" (or "KAPALI") event marks that date closed in `/api/appointments/available-slots`.
- Twilio: SMS confirmation sends to a real phone number, if SMS is included.

## Before Client Delivery

- Do not claim production delivery until the live domain points to this Next.js app.
- Set production env vars in the hosting provider.
- Submit one real test booking after production env vars are set.
- Confirm the client inbox/calendar receives the booking.
