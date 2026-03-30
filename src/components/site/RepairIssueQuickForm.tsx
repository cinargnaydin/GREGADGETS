"use client";

import { useState } from "react";

const issueOptions = [
  "Cracked Screen",
  "Battery Drain",
  "Charging Port",
  "Camera / Face ID",
  "Water Damage",
  "Data Transfer",
] as const;

type Status = "idle" | "sending" | "success" | "error";

export default function RepairIssueQuickForm() {
  const [selectedIssue, setSelectedIssue] = useState<string>(issueOptions[0]);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (phone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!consent) {
      setError("Please accept data processing.");
      return;
    }

    try {
      setStatus("sending");
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "",
          device: "",
          phone: phone.trim(),
          issue: selectedIssue,
          consent: true,
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setPhone("");
      setConsent(false);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {issueOptions.map((issue) => {
          const selected = selectedIssue === issue;
          return (
            <button
              key={issue}
              type="button"
              onClick={() => setSelectedIssue(issue)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                selected
                  ? "border-brand-red bg-red-50 text-brand-red-dark"
                  : "border-black/10 bg-white/80 hover:border-black/20"
              }`}
            >
              {issue}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="w-full rounded-xl border border-black/15 bg-white/90 px-3 py-2.5 text-sm outline-none transition-shadow md:w-72 focus:shadow-[0_0_0_3px_rgba(203,30,39,0.14)]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-brand-red to-brand-red-dark px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : `Get Quote for ${selectedIssue}`}
        </button>
      </div>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        I consent to being contacted regarding this repair request.
      </label>

      {error && <p className="text-sm text-brand-red">{error}</p>}
      {status === "success" && <p className="text-sm text-green-700">Thanks! We will contact you shortly.</p>}
      {status === "error" && <p className="text-sm text-brand-red">Something went wrong. Please try again.</p>}
    </form>
  );
}
