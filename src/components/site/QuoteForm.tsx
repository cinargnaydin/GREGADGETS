"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const quoteSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(8, "Please enter a valid phone."),
  device: z.string().optional(),
  issue: z.string().min(8, "Please describe the issue."),
  consent: z.boolean().refine((v) => v, "Please accept data processing."),
});

type QuoteValues = z.infer<typeof quoteSchema>;
const quickIssueOptions = [
  "Cracked screen",
  "Battery drains quickly",
  "Not charging",
  "Water damage",
];

export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", phone: "", device: "", issue: "", consent: false },
  });

  const onSubmit = async (values: QuoteValues) => {
    try {
      setStatus("sending");
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-panel space-y-4 rounded-3xl p-6"
    >
      <h2 className="text-2xl font-bold tracking-tight">Request a quick quote</h2>
      <p className="text-sm text-muted">Usually takes under 60 seconds. We reply quickly on WhatsApp or phone.</p>
      <Field label="Phone (required)" error={errors.phone?.message}>
        <input
          {...register("phone")}
          className="w-full rounded-xl border border-black/15 bg-white/85 px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(203,30,39,0.14)]"
        />
      </Field>
      <Field label="Issue details (required)" error={errors.issue?.message}>
        <textarea
          {...register("issue")}
          rows={4}
          placeholder="Example: iPhone 13 screen cracked, touch partly works."
          className="w-full rounded-xl border border-black/15 bg-white/85 px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(203,30,39,0.14)]"
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        {quickIssueOptions.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white"
            onClick={() => setValue("issue", item, { shouldValidate: true, shouldDirty: true })}
          >
            {item}
          </button>
        ))}
      </div>
      <Field label="Name (optional)" error={errors.name?.message}>
        <input
          {...register("name")}
          className="w-full rounded-xl border border-black/15 bg-white/85 px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(203,30,39,0.14)]"
        />
      </Field>
      <Field label="Device model (optional)" error={errors.device?.message}>
        <input
          {...register("device")}
          className="w-full rounded-xl border border-black/15 bg-white/85 px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(203,30,39,0.14)]"
        />
      </Field>
      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" {...register("consent")} className="mt-0.5" />
        I consent to being contacted regarding this repair request.
      </label>
      {errors.consent && <p className="text-sm text-brand-red">{errors.consent.message}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-brand-red to-brand-red-dark px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-lg disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/30 to-transparent motion-reduce:hidden" />
        <span className="relative z-10">{status === "sending" ? "Sending..." : "Get My Quote"}</span>
      </button>
      {status === "success" && <p className="text-sm text-green-700">Thanks! We will contact you shortly.</p>}
      {status === "error" && <p className="text-sm text-brand-red">Something went wrong. Please call us directly.</p>}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-brand-red">{error}</p>}
    </div>
  );
}
