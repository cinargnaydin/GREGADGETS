import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import HeroExperiment from "@/components/site/HeroExperiment";
import PhotoTile from "@/components/site/PhotoTile";
import JsonLd from "@/components/seo/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

const serviceCards = [
  {
    title: "Phone & Laptop Repair",
    text: "Screens, batteries, charging ports, keyboards, upgrades, and water damage.",
    href: "/repair-services",
  },
  {
    title: "Buy & Sell Devices",
    text: "Fair trade-in offers and straightforward upgrade options.",
    href: "/buy-sell",
  },
  {
    title: "Accessories & Protection",
    text: "Cases, tempered glass, chargers, and reliable daily essentials.",
    href: "/shop",
  },
  {
    title: "Perfumes & Lifestyle",
    text: "Popular fragrances and thoughtful in-store lifestyle picks.",
    href: "/shop",
  },
];

export default function Home() {
  const bookingHref = "/book";

  return (
    <div className="pb-8">
      <section className="pt-14 pb-8 md:pt-18">
        {/* Hero renders statically (no fade-in) so the LCP element paints on
            first render instead of waiting for client JS — fixes NO_LCP. */}
        <HeroExperiment />
      </section>

      <section className="py-8">
        <Reveal direction="left" className="container-base grid gap-4 md:grid-cols-3" delay={0.05}>
          {[
            ["Book Online in 60 Seconds", "Simple form and WhatsApp flow designed to get your quote quickly."],
            ["Walk-in or Collection Advice", "We support urgent walk-ins and help you choose the quickest route."],
            ["Warranty-backed Work", "Quality parts, careful fitting, and practical after-care guidance."],
          ].map(([title, text]) => (
            <article key={title} className="premium-card rounded-2xl p-5">
              <h2 className="text-base font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="py-14">
        <Reveal direction="right" className="container-base" delay={0.08}>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything your device needs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map(({ title, text, href }) => (
              <Link key={title} href={href} className="group block">
                <article className="premium-card rounded-2xl p-5 transition-transform group-hover:-translate-y-1">
                  <h3 className="font-bold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                  <p className="mt-3 text-xs font-semibold text-brand-red-dark group-hover:underline">Learn more →</p>
                </article>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-14">
        <Reveal direction="up" className="container-base" delay={0.08}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-red-dark">
                Greenwich High Road
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Step inside the shop</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Repairs, accessories, audio, gaming and travel essentials — all under one roof in the
                heart of Greenwich.
              </p>
            </div>
            <Link
              href="/shop"
              className="glass-panel rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              Browse the shop →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <PhotoTile
              src="/images/shopinterior2.png"
              alt="Greenwich Gadgets interior — phone cases and accessory display cabinets"
              caption="Accessories & display cases"
              className="h-72 md:h-[27rem]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
              <PhotoTile
                src="/images/shopinterior.png"
                alt="Greenwich Gadgets interior — accessory wall, headphones and travel bags"
                caption="Cases, audio & more"
                className="h-52 md:h-[13rem]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoTile
                src="/images/shopinterior4.jpg"
                alt="Greenwich Gadgets interior — gaming consoles, controllers and travel luggage"
                caption="Gaming & travel"
                className="h-52 md:h-[13rem]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoTile
                src="/images/repair-tech.jpg"
                alt="Technician carefully repairing a smartphone at the workbench"
                caption="Expert same-day repairs"
                className="h-52 md:h-[13rem]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <PhotoTile
                src="/images/shopinterior3.jpg"
                alt="Greenwich Gadgets interior — counter and everyday tech essentials"
                caption="Everyday essentials"
                className="h-52 md:h-[13rem]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-14">
        <Reveal direction="up" className="container-base glass-panel rounded-4xl p-6 md:p-8" delay={0.1}>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Repair by issue</h2>
              <p className="mt-3 text-sm text-muted">
                Pick your issue and choose a time — or message us on WhatsApp for a quick quote.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <GlowButton href={bookingHref}>Book a Repair</GlowButton>
                <GlowButton href={siteConfig.contact.whatsappHref} target="_blank">
                  WhatsApp Quote
                </GlowButton>
              </div>
            </div>
            <div>
              <Image
                src="/images/workbench-repair.jpg"
                alt="Technician repairing a phone at the Greenwich Gadgets workbench"
                width={600}
                height={600}
                className="h-72 w-full rounded-2xl border border-white/60 object-cover md:h-96"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-14">
        <Reveal direction="right" className="container-base" delay={0.1}>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Local customers, real feedback</h2>
          <div className="mt-6">
            <TestimonialSlider />
          </div>
        </Reveal>
      </section>

      <section className="py-10">
        <Reveal direction="up" className="container-base rounded-4xl border border-red-200/80 bg-linear-to-r from-red-50 via-white to-white p-8 shadow-[0_30px_80px_rgba(203,30,39,0.12)]" delay={0.14}>
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Book your repair slot online in under a minute, or message us for a quick quote.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <GlowButton href={bookingHref}>Book Appointment</GlowButton>
            <GlowButton href={siteConfig.contact.whatsappHref} target="_blank">
              WhatsApp Quote
            </GlowButton>
            <Link
              href={siteConfig.contact.mapsHref}
              className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </Link>
          </div>
        </Reveal>
      </section>

      <JsonLd
        id="localbusiness-home"
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: siteConfig.name,
          url: siteConfig.domain,
          telephone: siteConfig.contact.phoneDisplay,
          image: `${siteConfig.domain}/images/shopexterior.png`,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.line1,
            addressLocality: siteConfig.address.city,
            postalCode: siteConfig.address.area,
            addressCountry: siteConfig.address.country,
          },
        }}
      />
    </div>
  );
}
