# Deployment Guide

## 1) Local Verification
Run:

```bash
npm install
npm run lint
npm run build
```

## 2) Environment Variables
Set these in Vercel project settings:

- `NEXT_PUBLIC_SITE_URL=https://greenwichgadgets.com`
- `RESEND_API_KEY=...`
- `BOOKING_NOTIFICATION_EMAIL=...`
- `GOOGLE_CALENDAR_ID=...`
- `GOOGLE_CALENDAR_CLIENT_EMAIL=...`
- `GOOGLE_CALENDAR_PRIVATE_KEY=...` (service account shared into the bookings calendar with "Make changes to events")

## 3) Vercel Deployment
1. Import the repository into Vercel.
2. Confirm framework is Next.js.
3. Add environment variables for Production/Preview.
4. Deploy main branch.

## 4) Post-Deploy Validation
- Open `/sitemap.xml` and `/robots.txt`.
- Submit sitemap in Google Search Console.
- Complete a test booking on `/book` end-to-end and confirm the event appears on the Google Calendar.
- Verify call/WhatsApp/map buttons on mobile.
- Confirm structured data with Rich Results Test.

## 5) Monitoring Setup
- Keep Vercel Analytics enabled.
- Add Sentry for runtime error tracking.
- Add uptime monitor (UptimeRobot/Pingdom) for home and contact pages.
# Deployment Guide (Vercel)

## 1) Project Setup

1. Create a new Vercel project and import `greenwich-gadgets-web`.
2. Framework preset: `Next.js`.
3. Build command: `npm run build`.
4. Output: default Next.js output.

## 2) Environment Variables

Set the following in Vercel project settings:

- `NEXT_PUBLIC_SITE_URL` = production domain (e.g. `https://greenwichgadgets.com`)
- `RESEND_API_KEY` = Resend API key
- `BOOKING_NOTIFICATION_EMAIL` = destination mailbox for booking notifications
- `GOOGLE_CALENDAR_ID` = bookings calendar ID
- `GOOGLE_CALENDAR_CLIENT_EMAIL` = service account email
- `GOOGLE_CALENDAR_PRIVATE_KEY` = service account private key

## 3) Domain and DNS

1. Add production domain and optional `www` domain.
2. Enforce HTTPS.
3. Configure redirect from `www` to apex or vice versa.

## 4) Post-Deploy Verification

1. Open `/` and verify hero, logo, and glowing CTA buttons.
2. Open `/book` and complete a test booking.
3. Confirm the booking notification email arrives at `BOOKING_NOTIFICATION_EMAIL` and the event appears on the Google Calendar.
4. Verify:
   - `/sitemap.xml`
   - `/robots.txt`
   - structured data presence in page source

## 5) Analytics and Monitoring

1. Verify Vercel Analytics events are collected.
2. Add GA4 if required by marketing.
3. Configure Sentry (or equivalent) for runtime error alerts.
4. Add uptime checks for `/` and `/contact`.

## 6) Rollback Strategy

1. Keep previous successful deployment available in Vercel.
2. If a production issue occurs, rollback to the prior deployment.
3. Open a hotfix branch and redeploy once validated.
