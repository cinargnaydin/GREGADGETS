# Greenwich Gadgets — Customer & Shop Owner Flows

_A plain-English map of what happens end-to-end, and **who sees what** at each step._

This reflects the **current shipped code** (branch `main`). Two things worth knowing up front:

- **There is no customer login and no admin panel.** The admin panel was removed in the latest commit; it now exists only as a design document (`ADMIN_PANEL_MVP_TECHNICAL_PLAN.md`), not as running code.
- **The lead funnel (`/get-started`) is the single entry point.** Every "Book" / "Get a quote" button across the site routes here.

---

## The two personas

| Persona | How they interact | What they can see |
|---|---|---|
| **Customer** | Public website only — pages, the funnel, the booking wizard | Only their own screens + the email/SMS they receive. Never any stored data or dashboard. |
| **Shop owner** | No app/dashboard. Receives **email notifications** + a **Google Calendar event** per booking. | Emails in their inbox and appointments on their Google Calendar. That's it, today. |

---

## Part 1 — The Customer Flow

Everything starts from a **"Book / Get a quote" call-to-action** somewhere on the site (homepage, header, footer, mobile sticky bar, contact page). All of them lead to the same funnel: **`/get-started`**.

### Step 1 — Choose intent (`/get-started`)

The customer picks **one of three paths**:

1. **📅 Book a repair slot** — schedule an appointment
2. **💬 Get a quick WhatsApp quote** — get a price over WhatsApp
3. **📞 Request a callback** — ask the shop to call them

### Step 2 — Choose the issue

The customer picks what's wrong with their device: **Cracked Screen, Battery Drain, Charging Port, Camera / Face ID, Water Damage, or Data Transfer.**

From here the flow **splits by the path they chose in Step 1:**

---

### Path A — "Book a repair slot" → the Booking Wizard (`/book`)

The customer is taken straight to the appointment wizard. **No lead record is saved for this path** — they go directly into booking.

**The wizard has 4 steps:**

| Step | What the customer does | What they see |
|---|---|---|
| **1. Date** | Pick a day | 14 selectable days, **starting tomorrow** |
| **2. Time** | Pick a time | Live-loaded available slots (60-min slots, business hours only, already-booked and calendar-busy times removed) |
| **3. Details** | Enter **name, email, phone** (all required) | Email is validated on-screen; a summary of the chosen issue + slot |
| **4. Confirm** | Submit | ✅ _"You are all set! Your [issue] appointment for [date] at [time] has been confirmed. We have sent you an email and SMS confirmation."_ + a "Book Another" option |

**What the customer receives after booking:**
- ✉️ A **confirmation email** ("Appointment Confirmed")
- 📱 A **confirmation SMS**

> ⚠️ Note: the success screen always says "we've sent you an email and SMS." These are only actually sent in production (or when notifications are explicitly enabled) and when the email/SMS services are configured. In local development nothing is really sent.

**Double-booking is prevented** — the system re-checks the slot atomically at the moment of saving, so two customers can't grab the same time. If a slot was just taken, or is outside opening hours / in the past, the customer gets a clear error and picks again.

---

### Path B — "Get a quick WhatsApp quote"

| Step | What the customer does | What they see |
|---|---|---|
| **3. Details** | Enter phone (required), optional name & device model, tick a **consent checkbox** | The form |
| **4. Success** | — | An **"Open WhatsApp"** button with a **pre-filled message** (their issue / device / phone / name). The customer must **tap it to actually send** the message to the shop (`wa.me/447562720358`). |

A **lead record is saved** for this path.

---

### Path C — "Request a callback"

| Step | What the customer does | What they see |
|---|---|---|
| **3. Details** | Enter phone (required), urgency, optional name & device, tick **consent** | The form |
| **4. Success** | — | _"Thanks, we will call you back about your [issue] repair."_ |

A **lead record is saved** for this path.

---

### Other things the customer can do
- Tap **direct WhatsApp / phone / Google Maps** links (header, footer, `/contact`).
- Browse informational pages: `/repair-services`, `/buy-sell`, `/shop`, `/about`, `/faq`, legal pages.
- There is **no account, cart, or online checkout** — sales happen in person.

### Legacy quote form
An older quote form still exists in the code and posts to `/api/quote` (saving a lead + emailing the owner), but the site now steers customers to the funnel instead, so most customers won't see it.

---

## Part 2 — The Shop Owner Flow

> **Important:** In the current code the owner has **no dashboard, no login, no admin screen.** All owner visibility happens through **email** and **Google Calendar**.

### What the owner receives, per customer action:

| Customer action | Owner gets… | Where |
|---|---|---|
| **Books an appointment** | 📧 An **owner notification email** with full booking details (name, email, phone, issue, appointment ID) **+** a 📅 **Google Calendar event** for the slot | `BOOKING_NOTIFICATION_EMAIL` inbox + owner's Google Calendar |
| **Requests a WhatsApp quote / callback (funnel lead)** | 📧 A **"New website lead"** email with all details (issue, device, phone, urgency, how they want to be contacted, source page) | `LEAD_NOTIFICATION_EMAIL` (falls back to quote/booking email) |
| **Submits the legacy quote form** | 📧 A **"New quote request"** email | `QUOTE_RECEIVER_EMAIL` inbox |
| **WhatsApp path specifically** | 💬 A WhatsApp message — **only if the customer actually taps "Open WhatsApp"** to send it | Shop WhatsApp number |

### What the owner does next (manually, off-platform)
- **Booking:** the appointment is already on their Google Calendar. They just show up / prepare.
- **Callback lead:** they call the customer back using the phone number in the email.
- **WhatsApp / quote lead:** they reply on WhatsApp or call, and quote a price.

### What the owner **cannot** currently do in-app
- ❌ View a list of bookings/leads/quotes in a dashboard
- ❌ Update a lead's status (new → contacted → booked → won/lost)
- ❌ Edit opening hours / add day-off overrides from a UI

The building blocks for all of the above **exist in the backend** (lead list/update helpers, schedule settings, a lead-status update API) but are **not connected to any owner-facing screen**. Opening hours and closures, if they need changing, currently have to be edited directly in the database.

> A future **Supabase-backed admin panel** is fully specced in `ADMIN_PANEL_MVP_TECHNICAL_PLAN.md` — appointment/lead lists, status updates, notes, availability editor, configurable notification email — but **none of it is built yet.**

---

## Part 3 — Where the data lives

| Data | Stored as | Created when |
|---|---|---|
| **Appointments** | `appointments` collection (Firestore) | Customer completes the booking wizard |
| **Leads** (incl. legacy quotes) | `leads` collection (Firestore) | Customer submits WhatsApp/callback path, or the legacy quote form |
| **Opening hours / closures** | `schedule_settings` + `schedule_overrides` (Firestore) | Managed in data (no UI today) |

In production this is **Firebase Firestore**. In local development, with no Firebase keys, it falls back to an in-memory store (data is not persisted between restarts).

**Note on booking-path leads:** when a customer chooses "Book a repair slot" from the funnel, **no separate lead is saved** — they go straight to booking, and only an appointment record is created. Lead records come from the WhatsApp/callback paths and the legacy quote form.

---

## Part 4 — Notifications at a glance

- **Email** is sent via **Resend**.
- **SMS** is sent via **Twilio** (booking confirmations to the customer only).
- **Calendar** events are created in **Google Calendar** (owner visibility).
- **Master switch:** real emails/SMS only go out in **production**, or when explicitly enabled. In dev, responses are marked "preview-only" and nothing is actually sent.
- Customer confirmations are **fire-and-forget** — if an email or SMS fails to send, the booking still succeeds and the customer still sees the confirmation screen.

| Who | Email | SMS | Calendar |
|---|---|---|---|
| **Customer** | ✅ Booking confirmation | ✅ Booking confirmation | — |
| **Owner** | ✅ Booking / lead / quote notifications | — | ✅ Event per booking |

---

## One-glance summary

```
CUSTOMER                                          SHOP OWNER
────────                                          ──────────
Clicks "Book / Get a quote"
        │
        ▼
   /get-started  (pick intent + issue)
        │
        ├── Book a slot ──► /book wizard ──► ✅ on-screen confirm
        │                                    ✉️ + 📱 to customer ───► ✉️ owner email
        │                                                            📅 calendar event
        │
        ├── WhatsApp quote ─► save lead ──► "Open WhatsApp" button ─► ✉️ owner "new lead" email
        │                                   (customer taps to send) ─► 💬 WhatsApp msg (if tapped)
        │
        └── Callback ───────► save lead ──► "We'll call you back" ──► ✉️ owner "new lead" email
                                                                       📞 owner calls back manually

Owner has NO dashboard today — works entirely from inbox + Google Calendar.
```
