"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import { siteConfig } from "@/content/site";

type Variant = "a" | "b";

const STORAGE_KEY = "gg_hero_variant_v1";

export default function HeroExperiment() {
  const [variant] = useState<Variant>(() => {
    if (typeof window === "undefined") return "a";
    const existing = window.localStorage.getItem(STORAGE_KEY) as Variant | null;
    if (existing === "a" || existing === "b") return existing;
    const assigned: Variant = Math.random() > 0.5 ? "a" : "b";
    window.localStorage.setItem(STORAGE_KEY, assigned);
    return assigned;
  });

  if (variant === "b") {
    return (
      <div className="container-base">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <article className="glass-panel overflow-hidden rounded-3xl p-2 sm:col-span-2">
              <Image
                src="/images/shopexterior.png"
                alt="Greenwich Gadgets storefront"
                width={1400}
                height={900}
                priority
                className="h-56 w-full rounded-2xl border border-white/70 object-cover object-[center_10%]"
              />
            </article>
            <article className="premium-card rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-red-dark">Turnaround</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">Same Day</p>
              <p className="mt-2 text-sm text-muted">Most screen and battery jobs are completed in hours.</p>
            </article>
            <article className="premium-card rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-red-dark">Peace of mind</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">Warranty</p>
              <p className="mt-2 text-sm text-muted">Quality parts with clear after-care guidance.</p>
            </article>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel rounded-4xl p-7 md:p-9">
              <p className="inline-flex rounded-full border border-black/10 bg-white/75 px-4 py-1.5 text-sm font-semibold text-brand-red-dark">
                Repair. Quote. Done.
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Cracked screen today.
                <span className="block text-black/70">Back in your hand today.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted">
                Fast diagnostics, transparent pricing and WhatsApp-first support for Greenwich.
                Walk-ins welcome.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <GlowButton href="/contact">Check My Repair Cost</GlowButton>
                <Link
                  href="/repair-services"
                  className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  Browse Repairs
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {siteConfig.trustPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-sm font-medium"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-base">
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-4xl p-7 md:p-9">
            <p className="inline-flex rounded-full border border-black/10 bg-white/75 px-4 py-1.5 text-sm font-semibold text-brand-red-dark">
              Greenwich High Road - London
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Same-day phone repair.
              <span className="block text-black/70">Built for people in a rush.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              Screen, battery, charging and water-damage fixes with clear quotes before repair.
              Walk in, message on WhatsApp, or book online in under a minute.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <GlowButton href="/contact">Get Repair Quote</GlowButton>
              <Link
                href="/repair-services"
                className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                See Repair Menu
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {siteConfig.trustPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-sm font-medium"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
          <article className="premium-card rounded-3xl p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red-dark">Fast lane</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">15-60 min</p>
            <p className="mt-2 text-sm text-muted">Most common repairs completed same day with live progress updates.</p>
          </article>

          <article className="glass-panel overflow-hidden rounded-3xl p-2 sm:col-span-2">
            <Image
              src="/images/shopexterior.png"
              alt="Greenwich Gadgets storefront"
              width={1200}
              height={900}
              priority
              className="h-48 w-full rounded-2xl border border-white/70 object-cover object-[center_10%] md:h-56"
            />
          </article>

          <article className="premium-card rounded-3xl p-5">
            <p className="text-sm font-semibold">No-fix, no-obligation advice</p>
            <p className="mt-2 text-sm text-muted">We confirm your options before any paid repair begins.</p>
          </article>

          <article className="glass-panel overflow-hidden rounded-3xl p-2">
            <Image
              src="/images/cracked-screen-closeup.jpg"
              alt="Cracked smartphone screen closeup before repair"
              width={900}
              height={900}
              className="h-full w-full rounded-2xl border border-white/70 object-cover"
            />
          </article>
        </div>
      </div>
    </div>
  );
}
