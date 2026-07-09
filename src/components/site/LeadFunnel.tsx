"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/content/site";
import type { LeadPreferredContact, LeadUrgency } from "@/lib/leads";

type Step = "intent" | "issue" | "details" | "success";
type FunnelIntent = "booking" | "whatsapp" | "callback";
type FormStatus = "idle" | "sending" | "error";

type LeadFunnelProps = {
  sourcePage: string;
  heading?: string;
};

type IntentOption = {
  value: FunnelIntent;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const urgencyOptions: Array<{ value: LeadUrgency; label: string }> = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this_week", label: "This week" },
  { value: "flexible", label: "Flexible" },
];

export default function LeadFunnel({
  sourcePage,
  heading = "How can we help with your repair?",
}: LeadFunnelProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intent");
  const [intent, setIntent] = useState<FunnelIntent | null>(null);
  const [issue, setIssue] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [device, setDevice] = useState("");
  const [urgency, setUrgency] = useState<LeadUrgency | "">("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [phoneTracked, setPhoneTracked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    trackLeadEvent("lead_funnel_started", { sourcePage });
  }, [sourcePage]);

  const intentOptions = useMemo<IntentOption[]>(
    () => [
      {
        value: "booking",
        title: "Book a repair slot",
        description: "Choose the repair and go straight to available times.",
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        value: "whatsapp",
        title: "Get a quick WhatsApp quote",
        description: "Send the repair details and we will reply with next steps.",
        icon: <MessageCircle className="h-5 w-5" />,
      },
      {
        value: "callback",
        title: "Request a callback",
        description: "Tell us the issue and when you need help.",
        icon: <Phone className="h-5 w-5" />,
      },
    ],
    []
  );

  const selectedIntent = intentOptions.find((option) => option.value === intent);
  const isCallback = intent === "callback";
  const isWhatsApp = intent === "whatsapp";

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hi Greenwich Gadgets, I'd like a quick repair quote.",
      issue ? `Issue: ${issue}` : "",
      device.trim() ? `Device: ${device.trim()}` : "",
      phoneNumber.trim() ? `Phone: ${phoneNumber.trim()}` : "",
      name.trim() ? `Name: ${name.trim()}` : "",
    ].filter(Boolean);

    return `${siteConfig.contact.whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [device, issue, name, phoneNumber]);

  const chooseIntent = (nextIntent: FunnelIntent) => {
    setIntent(nextIntent);
    setIssue("");
    setError("");
    setStatus("idle");
    setSuccessMessage("");
    setStep("issue");
    trackLeadEvent("lead_funnel_intent_selected", { sourcePage, intent: nextIntent });
  };

  const chooseIssue = (selectedIssue: string) => {
    setIssue(selectedIssue);
    setError("");

    if (intent === "booking") {
      trackLeadEvent("booking_path_selected", { sourcePage, issue: selectedIssue });
      router.push(`/book?issue=${encodeURIComponent(selectedIssue)}`);
      return;
    }

    setStep("details");
  };

  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!intent || intent === "booking" || !issue) {
      setError("Please choose how you would like us to help.");
      return;
    }

    if (phoneNumber.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (isCallback && !urgency) {
      setError("Please choose how soon you need help.");
      return;
    }

    if (!consent) {
      setError("Please confirm we can contact you about this repair.");
      return;
    }

    const preferredContact: LeadPreferredContact = isWhatsApp ? "whatsapp" : "phone";
    const submittedUrgency: LeadUrgency = isCallback && urgency ? urgency : "flexible";

    try {
      setStatus("sending");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "repair",
          sourcePage,
          sourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
          name,
          phone: phoneNumber,
          issue,
          device,
          urgency: submittedUrgency,
          preferredContact,
          consent,
          utm: collectAttribution(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Repair request failed.");

      trackLeadEvent(isWhatsApp ? "whatsapp_quote_submitted" : "callback_requested", {
        sourcePage,
        issue,
        urgency: submittedUrgency,
      });

      if (isWhatsApp) {
        setSuccessMessage(
          "Thanks, your quote request is ready. Use the WhatsApp button below to send the prefilled message."
        );
      } else {
        setSuccessMessage(
          `Thanks, we will call you back about your ${issue.toLowerCase()} repair.`
        );
      }

      setStep("success");
      setStatus("idle");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not send your request. Please try again."
      );
      setStatus("error");
    }
  };

  const handlePhoneBlur = () => {
    if (phoneTracked || phoneNumber.trim().length < 8) return;

    trackLeadEvent("phone_entered", { sourcePage, issue });
    setPhoneTracked(true);
  };

  const resetFunnel = () => {
    setStep("intent");
    setIntent(null);
    setIssue("");
    setName("");
    setPhoneNumber("");
    setDevice("");
    setUrgency("");
    setConsent(false);
    setError("");
    setStatus("idle");
    setPhoneTracked(false);
    setSuccessMessage("");
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
      <div className="bg-brand-red p-6 text-white">
        <p className="text-sm font-semibold text-red-100">Repair help</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{heading}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium">
          {["Choose", "Issue", "Details"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {step === "intent" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-black">What would you like to do?</h2>
              <p className="mt-1 text-sm text-gray-500">
                Pick the fastest way for us to help with your repair.
              </p>
            </div>
            <div className="grid gap-3">
              {intentOptions.map((option) => (
                <ActionButton
                  key={option.value}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  onClick={() => chooseIntent(option.value)}
                />
              ))}
            </div>
          </div>
        )}

        {step === "issue" && selectedIntent && (
          <div className="space-y-5">
            <BackButton onClick={() => setStep("intent")}>Back</BackButton>
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-black">
                <Wrench className="h-5 w-5 text-brand-red" /> What needs fixing?
              </h2>
              <p className="mt-1 text-sm text-gray-500">{selectedIntent.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {siteConfig.repairIssues.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseIssue(option)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900 transition-all hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-brand-red"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "details" && selectedIntent && issue && (
          <form onSubmit={submitLead} className="space-y-5">
            <BackButton onClick={() => setStep("issue")}>Back to repair issue</BackButton>
            <div>
              <p className="text-sm font-semibold text-brand-red">{selectedIntent.title}</p>
              <h2 className="mt-1 text-xl font-bold text-black">{issue}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add the best number for this repair. We only use this to contact you about this
                repair.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                onBlur={handlePhoneBlur}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black outline-none focus:ring-2 focus:ring-brand-red"
                placeholder="07340 327305"
                required
              />
              <p className="mt-1.5 text-xs text-gray-500">
                We only use this to contact you about this repair.
              </p>
            </div>

            {isCallback && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  How soon do you need help?
                </label>
                <div className="grid gap-2 sm:grid-cols-4">
                  {urgencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setUrgency(option.value)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        urgency === option.value
                          ? "border-brand-red bg-red-50 text-brand-red-dark"
                          : "border-gray-200 text-gray-700 hover:border-red-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {isCallback && (
                <OptionalField label="Name">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-brand-red"
                    placeholder="Optional"
                  />
                </OptionalField>
              )}
              <OptionalField label="Device model">
                <input
                  value={device}
                  onChange={(event) => setDevice(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-brand-red"
                  placeholder="iPhone 13, Samsung S22..."
                />
              </OptionalField>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5"
                required
              />
              I agree that Greenwich Gadgets can contact me about this repair.
            </label>

            {error && <p className="text-sm font-medium text-brand-red">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-brand-red px-5 py-4 text-base font-bold text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending..."
                : isWhatsApp
                  ? "Get WhatsApp quote"
                  : "Request callback"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-black">Thanks, we have your request</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{successMessage}</p>
            {isWhatsApp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
              >
                Open WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={resetFunnel}
              className="mt-6 block w-full rounded-xl bg-gray-100 px-5 py-3 text-sm font-bold text-black hover:bg-gray-200 sm:mx-auto sm:w-auto"
            >
              Start again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BackButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-black"
    >
      <ChevronLeft className="h-4 w-4" />
      {children}
    </button>
  );
}

function OptionalField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function ActionButton({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-brand-red"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand-red">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-black">{title}</span>
        <span className="mt-1 block text-sm text-gray-500">{description}</span>
      </span>
    </button>
  );
}

function collectAttribution() {
  if (typeof window === "undefined") return {};

  const allowedKeys = new Set([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ]);
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    Array.from(params.entries()).filter(([key, value]) => allowedKeys.has(key) && value)
  );
}

function trackLeadEvent(name: string, properties: Record<string, string | undefined>) {
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => typeof value === "string" && value)
  ) as Record<string, string>;

  track(name, safeProperties);
}
