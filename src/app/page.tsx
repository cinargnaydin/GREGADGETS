import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import HeroExperiment from "@/components/site/HeroExperiment";
import RepairIssueQuickForm from "@/components/site/RepairIssueQuickForm";
import BookingWidget from "@/components/booking/BookingWidget";
import JsonLd from "@/components/seo/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <div className="pb-8">
      <section className="pt-14 pb-8 md:pt-18">
        <Reveal>
          <HeroExperiment />
        </Reveal>
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
            {[
              ["Phone & Tablet Repair", "Screen, battery, charging port, camera, and water damage support."],
              ["Buy & Sell Devices", "Fair trade-in offers and straightforward upgrade options."],
              ["Accessories & Protection", "Cases, tempered glass, chargers, and reliable daily essentials."],
              ["Perfumes & Lifestyle", "Popular fragrances and thoughtful in-store lifestyle picks."],
            ].map(([title, text]) => (
              <article key={title} className="premium-card rounded-2xl p-5">
                <h3 className="font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-14">
        <Reveal direction="up" className="container-base glass-panel rounded-4xl p-6 md:p-8" delay={0.1}>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Repair by issue</h2>
              <p className="mt-3 text-sm text-muted">
                Pick your issue, enter phone number, and submit. We will get back quickly with a quote.
              </p>
              <div className="mt-4">
                <RepairIssueQuickForm />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Image
                src="/images/repair-tech.jpg"
                alt="Technician repairing smartphone components"
                width={600}
                height={600}
                className="rounded-2xl border border-white/60 object-cover"
              />
              <Image
                src="/images/cracked-screen-closeup.jpg"
                alt="Cracked smartphone screen closeup before repair"
                width={600}
                height={600}
                className="rounded-2xl border border-white/60 object-cover"
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

      <section className="py-14">
        <Reveal direction="up" className="container-base" delay={0.12}>
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Schedule Your Visit</h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Choose a convenient time from our available slots below to secure your repair fast. No upfront cost.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <BookingWidget />
          </div>
        </Reveal>
      </section>

      <section className="py-10">
        <Reveal direction="up" className="container-base rounded-4xl border border-red-200/80 bg-linear-to-r from-red-50 via-white to-white p-8 shadow-[0_30px_80px_rgba(203,30,39,0.12)]" delay={0.14}>
          <h2 className="text-3xl font-bold tracking-tight">Need help now?</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Visit us on Greenwich High Road or message us for a quick quote with fast turnaround.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <GlowButton href="/contact">WhatsApp Quote</GlowButton>
            <Link
              href={siteConfig.contact.mapsHref}
              className="glass-panel rounded-full px-5 py-3 text-sm font-semibold"
              target="_blank"
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
            addressCountry: siteConfig.address.country,
          },
        }}
      />
    </div>
  );
}
