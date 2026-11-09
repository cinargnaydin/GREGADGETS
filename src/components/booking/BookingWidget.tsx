'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Wrench, CheckCircle2, Phone, Smartphone, Laptop, CalendarDays, PencilLine } from 'lucide-react';
import { track } from '@vercel/analytics/react';
import { siteConfig } from '@/content/site';
import { submitBooking, type BookingState } from '@/lib/booking';

const initialBookingState: BookingState = { ok: false, message: '' };

// Cap the free-text problem description so the note stays a short summary.
const NOTE_CHAR_LIMIT = 300;

type BookingWidgetProps = {
  // Optional pre-selected repair passed via ?issue= on the URL.
  issue?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand-red px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Sending…' : 'Send Repair Request'}
    </button>
  );
}

export default function BookingWidget({ issue }: BookingWidgetProps) {
  const [state, formAction] = useActionState(submitBooking, initialBookingState);

  // Device type drives which brand suggestions and repair issues we show.
  // If the URL pre-selects a phone issue we start on Phone, otherwise default to Phone too.
  const [deviceType, setDeviceType] = useState<'Phone' | 'Laptop'>('Phone');
  const isLaptop = deviceType === 'Laptop';

  // Track the chosen issue so we can reveal a free-text note when it's "Other".
  // Pre-fill from the URL only when it matches an existing phone option (same rule as the select).
  const [selectedIssue, setSelectedIssue] = useState('');
  const [note, setNote] = useState('');
  const showNote = selectedIssue === 'Other';
  const noteCharCount = note.length;
  const brandSuggestions = isLaptop ? siteConfig.laptopBrands : siteConfig.phoneBrands;
  const issueOptions = isLaptop ? siteConfig.laptopIssues : siteConfig.repairIssues;

  useEffect(() => {
    track('booking_form_opened', { issue: issue || 'not_provided' });
  }, [issue]);

  useEffect(() => {
    if (state.ok) {
      track('booking_request_sent');
    }
  }, [state.ok]);

  // Minimum selectable day is today — no point booking a repair in the past.
  const today = new Date();
  const minDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  if (state.ok) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-black">Request sent</h2>
        <p className="mt-2 text-gray-600">{state.message}</p>
        <p className="mt-6 text-sm text-gray-500">
          Prefer to talk to us now? Call{' '}
          <a href={siteConfig.contact.phoneHref} className="font-semibold text-brand-red">
            {siteConfig.contact.phoneDisplay}
          </a>{' '}
          or{' '}
          <a
            href={siteConfig.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-red"
          >
            message us on WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-brand-red-dark bg-brand-red p-6">
        <h2 className="text-xl font-bold text-white">Book a Repair</h2>
        <p className="mt-1 text-sm text-red-100">
          Tell us a few details and we&apos;ll get back to you to confirm.
        </p>
      </div>

      <form action={formAction} className="space-y-5 p-6 md:p-8" noValidate>
        {/* Device type — switches the brand suggestions and repair issues below */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-900">What are we fixing?</span>
          <div className="grid grid-cols-2 gap-3">
            {(['Phone', 'Laptop'] as const).map((type) => {
              const active = deviceType === type;
              const Icon = type === 'Phone' ? Smartphone : Laptop;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setDeviceType(type);
                    // Switching device resets the select (via key), so clear the note too.
                    setSelectedIssue('');
                    setNote('');
                  }}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? 'border-brand-red bg-brand-red text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-red/50'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {type}
                </button>
              );
            })}
          </div>
          {/* Submitted so the shop knows the device category in the email. */}
          <input type="hidden" name="device" value={deviceType} />
        </div>

        {/* Phone number */}
        <div>
          <label htmlFor="phone" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Phone className="h-4 w-4 text-gray-400" /> Your phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="e.g. 07340 327305"
            aria-invalid={Boolean(state.errors?.phone)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          />
          {state.errors?.phone && (
            <p className="mt-1 text-sm text-brand-red">{state.errors.phone}</p>
          )}
        </div>

        {/* Device brand */}
        <div>
          <label htmlFor="brand" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            {isLaptop ? (
              <Laptop className="h-4 w-4 text-gray-400" />
            ) : (
              <Smartphone className="h-4 w-4 text-gray-400" />
            )}{' '}
            {isLaptop ? 'Laptop brand' : 'Phone brand'}
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            list="device-brands"
            required
            placeholder={
              isLaptop
                ? 'e.g. Apple MacBook, Dell, HP, Lenovo'
                : 'e.g. Apple iPhone, Samsung, Google Pixel'
            }
            aria-invalid={Boolean(state.errors?.brand)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          />
          <datalist id="device-brands">
            {brandSuggestions.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
          {state.errors?.brand && (
            <p className="mt-1 text-sm text-brand-red">{state.errors.brand}</p>
          )}
        </div>

        {/* What's broken */}
        <div>
          <label htmlFor="issue" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            <Wrench className="h-4 w-4 text-gray-400" /> What&apos;s broken?
          </label>
          {/* Keyed by device type so switching resets the selection to the placeholder. */}
          <select
            key={deviceType}
            id="issue"
            name="issue"
            required
            defaultValue={!isLaptop && issue && issueOptions.includes(issue) ? issue : ''}
            onChange={(e) => setSelectedIssue(e.target.value)}
            aria-invalid={Boolean(state.errors?.issue)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          >
            <option value="" disabled>
              Select the issue…
            </option>
            {issueOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
          {state.errors?.issue && (
            <p className="mt-1 text-sm text-brand-red">{state.errors.issue}</p>
          )}
        </div>

        {/* Free-text note — only shown when the customer picks "Something else". */}
        {showNote && (
          <div>
            <label
              htmlFor="note"
              className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900"
            >
              <PencilLine className="h-4 w-4 text-gray-400" /> Tell us what&apos;s wrong
            </label>
            <textarea
              id="note"
              name="note"
              rows={4}
              required
              maxLength={NOTE_CHAR_LIMIT}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the problem with your device — what happens, when it started, anything you've tried."
              aria-invalid={Boolean(state.errors?.note)}
              aria-describedby="note-count"
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
            />
            <div className="mt-1 flex items-center justify-between">
              {state.errors?.note ? (
                <p className="text-sm text-brand-red">{state.errors.note}</p>
              ) : (
                <span />
              )}
              <span
                id="note-count"
                className={`text-xs ${
                  noteCharCount >= NOTE_CHAR_LIMIT ? 'text-brand-red' : 'text-gray-400'
                }`}
              >
                {noteCharCount}/{NOTE_CHAR_LIMIT} characters
              </span>
            </div>
          </div>
        )}

        {/* Preferred day */}
        <div>
          <label htmlFor="day" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-900">
            <CalendarDays className="h-4 w-4 text-gray-400" /> Day you&apos;d like it fixed
          </label>
          <input
            id="day"
            name="day"
            type="date"
            required
            min={minDay}
            aria-invalid={Boolean(state.errors?.day)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          />
          {state.errors?.day && (
            <p className="mt-1 text-sm text-brand-red">{state.errors.day}</p>
          )}
        </div>

        {/* General (non-field) error message */}
        {!state.ok && state.message && !state.errors && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-brand-red" aria-live="polite">
            {state.message}
          </p>
        )}

        <SubmitButton />

        <p className="text-center text-xs text-gray-400">
          We only use these details to arrange your repair.
        </p>
      </form>
    </div>
  );
}
