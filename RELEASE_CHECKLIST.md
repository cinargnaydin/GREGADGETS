# Greenwich Gadgets Release Checklist

## Core Functionality
- [ ] Homepage loads with hero, trust sections, testimonials, and CTA buttons.
- [ ] Navigation links work on all pages.
- [ ] Booking flow (`/book`) completes: issue → date → time → details → success.
- [ ] Call, WhatsApp, and Directions links are clickable on mobile and desktop.

## Content and Brand
- [ ] Logo displays correctly in header (without extra text label).
- [ ] Shop images load correctly from `public/images`.
- [ ] Copy reflects Greenwich-focused services and tone.
- [ ] Puff/vape content includes adult-use compliance wording.

## SEO and Local Search
- [ ] Metadata is unique per page.
- [ ] Canonical URLs resolve correctly.
- [ ] `sitemap.xml` is available.
- [ ] `robots.txt` is available.
- [ ] JSON-LD is present for LocalBusiness, FAQ, Service, Breadcrumb where implemented.
- [ ] NAP details are consistent on contact page and schema.

## Performance and Accessibility
- [ ] `npm run build` passes.
- [ ] Lighthouse target: Desktop >= 90, Mobile >= 80 (overall).
- [ ] Keyboard navigation works across menus, buttons, and form.
- [ ] Visible focus ring exists on interactive controls.
- [ ] Animations behave safely with reduced motion preferences.

## Security and Operations
- [ ] Security headers are active from `next.config.ts`.
- [ ] Environment variables are set in production:
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`
  - `BOOKING_NOTIFICATION_EMAIL`
  - `GOOGLE_CALENDAR_ID`
  - `GOOGLE_CALENDAR_CLIENT_EMAIL`
  - `GOOGLE_CALENDAR_PRIVATE_KEY`
- [ ] Analytics is enabled (`@vercel/analytics`).
- [ ] Error monitoring is configured (recommended: Sentry).

## Pre-Launch Final Step
- [ ] Verify on Chrome, Edge, Safari, Firefox + iOS Safari + Android Chrome.
# Greenwich Gadgets Release Checklist

## Pre-Release Technical Checks

- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run build` passes and routes are generated.
- [ ] All required env vars are set:
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`
  - `BOOKING_NOTIFICATION_EMAIL`
  - `GOOGLE_CALENDAR_ID`
  - `GOOGLE_CALENDAR_CLIENT_EMAIL`
  - `GOOGLE_CALENDAR_PRIVATE_KEY`
- [ ] API endpoint `/api/appointments/book` returns 200 for a valid payload.
- [ ] Booking service account is shared into the calendar with "Make changes to events".
- [ ] Security headers are present in response (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

## Content and UX Checks

- [ ] Header logo displays correctly on desktop and mobile.
- [ ] Primary glowing CTA buttons appear in navbar, hero, final CTA, and form submit.
- [ ] Contact data (NAP) is consistent across homepage, contact page, and schema.
- [ ] Puff/vape copy includes age-compliance wording.
- [ ] Legal pages are present (`/privacy-policy`, `/terms`, `/cookie-policy`).

## SEO and Structured Data Checks

- [ ] Page title and description are unique for all core routes.
- [ ] Canonical URL is set correctly.
- [ ] JSON-LD is valid for:
  - LocalBusiness
  - Service
  - FAQPage
  - BreadcrumbList
- [ ] `/sitemap.xml` and `/robots.txt` are accessible.

## Performance and Accessibility Checks

- [ ] Lighthouse scores meet target (Desktop >= 90, Mobile >= 80).
- [ ] Core Web Vitals are in green thresholds.
- [ ] Keyboard-only navigation works for nav, CTAs, and form controls.
- [ ] Form error messages are visible and understandable.
- [ ] Reduced-motion users do not rely on animation for core actions.

## Launch and Monitoring Checks

- [ ] Production domain configured and HTTPS active.
- [ ] Search Console property verified and sitemap submitted.
- [ ] GA4 and Vercel Analytics events verified.
- [ ] Sentry (or equivalent) error monitoring configured.
- [ ] Uptime monitor configured for homepage and contact page.
