# Greenwich Gadgets — Customer & Shop Owner Flows

_A plain-English map of what happens end-to-end, and **who sees what** at each step._

This reflects the **current shipped code**. Two things worth knowing up front:

- **There is no customer login and no admin panel.** Owner visibility happens entirely through email and Google Calendar.
- **Booking is the single call-to-action.** Every "Book" / "Book Now" / "Book a Repair" button across the site routes to **`/book`**. There is no lead funnel, quote form, or CRM — the site is "call us or book a slot." (`/get-started` still exists but permanently redirects to `/book` for old links.)

---

## The two personas

| Persona | How they interact | What they can see |
|---|---|---|
| **Customer** | Public website only — pages and the booking wizard | Only their own screens + the email/SMS they receive. Never any stored data or dashboard. |
| **Shop owner** | No app/dashboard. Receives **email notifications** + a **Google Calendar event** per booking. | Emails in their inbox and appointments on their Google Calendar. That's it. |

---

## Part 1 — The Customer Flow

Everything starts from a **"Book" call-to-action** somewhere on the site (homepage, header, footer, contact page, repair-services page). All of them lead to the booking wizard at **`/book`**. Customers who want a price instead just tap **WhatsApp / phone** links directly — those are not tracked anywhere.

### The Booking Wizard (`/book`)

The wizard has 4 steps (issue is pre-selected if the visitor arrived via `/book?issue=…`):

| Step | What the customer does | What they see |
|---|---|---|
| **1. Issue** | Pick what's wrong | Cracked Screen, Battery Drain, Charging Port, Camera / Face ID, Water Damage, Data Transfer |
| **2. Date** | Pick a day | 14 selectable days, **starting tomorrow** |
| **3. Time** | Pick a time | Live-loaded available slots (60-min slots, on the hour, business hours only; already-booked and calendar-busy times removed; closed days show a "we're closed" message) |
| **4. Details** | Enter **name, email, phone** (all required) | Email is validated on-screen; a summary of the chosen issue + slot |
| **Confirm** | Submit | ✅ _"You are all set! Your [issue] appointment for [date] at [time] has been confirmed…"_ + a "Book Another" option |

**What the customer receives after booking:**
- ✉️ A **confirmation email** ("Appointment Confirmed")
- 📱 A **confirmation SMS**

> ⚠️ Note: the success screen always says "we've sent you an email and SMS." These are only actually sent in production (or when notifications are explicitly enabled) and when the email/SMS services are configured. In local development nothing is really sent.

**Double-booking** is handled on a **best-effort** basis: because the Google Calendar has no atomic guard, the server re-checks the slot's busy times **immediately before** creating the event. At this booking volume the remaining race (two people booking the same instant) is extremely unlikely. If the slot was just taken, or is outside opening hours / in the past, the customer gets a clear error and picks again. If the calendar event can't be created, the customer is told the booking couldn't be confirmed (never a false success).

### Other things the customer can do
- Tap **direct WhatsApp / phone / Google Maps** links (header, footer, `/contact`).
- Browse informational pages: `/repair-services`, `/buy-sell`, `/shop`, `/about`, `/faq`, legal pages.
- There is **no account, cart, or online checkout** — sales happen in person.

---

## Part 2 — The Shop Owner Flow

> **Important:** The owner has **no dashboard, no login, no admin screen.** All owner visibility happens through **email** and **Google Calendar**.

### What the owner receives, per customer action:

| Customer action | Owner gets… | Where |
|---|---|---|
| **Books an appointment** | 📧 An **owner notification email** with full booking details (name, email, phone, issue, appointment ID) **+** a 📅 **Google Calendar event** for the slot | `BOOKING_NOTIFICATION_EMAIL` inbox + the bookings Google Calendar |
| **Taps WhatsApp / phone directly** | 💬 A WhatsApp message or 📞 call — handled entirely off-platform, nothing stored | Shop WhatsApp number / phone |

### What the owner does next (manually, off-platform)
- **Booking:** the appointment is already on their Google Calendar. They just show up / prepare.
- **WhatsApp / call:** they reply or quote a price directly.

### Managing availability
- **Weekly opening hours** live in code config (`src/content/schedule.ts`, `WEEKLY_HOURS`) — currently Mon–Fri 08:30–20:00, Sat 09:00–20:00, Sun 12:00–15:00. Changing them is a code edit.
- **Ad-hoc closures** are managed **from Google Calendar**: add an **all-day event titled "CLOSED"** (or "KAPALI") on the date, and that day is marked closed in the availability API and the booking wizard. No UI or database needed.

---

## Part 3 — Where the data lives

**The Google Calendar is the single source of truth.** There is no separate customer database.

| Data | Stored as | Created when |
|---|---|---|
| **Appointments** | Timed events on the bookings Google Calendar | Customer completes the booking wizard |
| **Closures** | All-day "CLOSED" events on the same calendar | Owner adds them in Google Calendar |
| **Weekly opening hours** | `WEEKLY_HOURS` in `src/content/schedule.ts` (code) | Edited in code |

All appointment details (name / email / phone / issue) live only in the calendar event's title and description. In local development, with no `GOOGLE_CALENDAR_ID` set, bookings fall back to an in-memory store (not persisted between restarts) so the flow stays clickable.

---

## Part 4 — Notifications at a glance

- **Email** is sent via **Resend**.
- **SMS** is sent via **Twilio** (booking confirmations to the customer only).
- **Calendar** events are created in **Google Calendar** (the booking itself + owner visibility).
- **Master switch:** real emails/SMS only go out in **production**, or when explicitly enabled. In dev, responses are marked "preview-only" and nothing is actually sent.
- Customer confirmations are **fire-and-forget** — if an email or SMS fails to send, the booking still succeeds and the customer still sees the confirmation screen.

| Who | Email | SMS | Calendar |
|---|---|---|---|
| **Customer** | ✅ Booking confirmation | ✅ Booking confirmation | — |
| **Owner** | ✅ Booking notification | — | ✅ Event per booking (the booking itself) |

---

## One-glance summary

```
CUSTOMER                                          SHOP OWNER
────────                                          ──────────
Clicks "Book"
        │
        ▼
   /book wizard  (issue → date → time → details)
        │
        └── Confirm ──► ✅ on-screen confirm
                        ✉️ + 📱 to customer ───► ✉️ owner email
                        📅 calendar event  ───► 📅 the booking on Google Calendar

Direct WhatsApp / phone links ─────────────────► 💬 / 📞 handled off-platform (nothing stored)

Owner has NO dashboard — works entirely from inbox + Google Calendar.
Availability = WEEKLY_HOURS in code + all-day "CLOSED" calendar events.
```
