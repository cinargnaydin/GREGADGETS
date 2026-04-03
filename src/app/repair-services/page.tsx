import type { Metadata } from "next";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import QuoteForm from "@/components/site/QuoteForm";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: "Repair Services | Greenwich Gadgets",
  description: "Phone, tablet, and laptop repair services in Greenwich with fast turnaround.",
  path: "/repair-services",
});

export default function RepairServicesPage() {
  return (
    <>
      <div className="py-14 md:py-16">
        <div className="container-base grid gap-8 md:grid-cols-2">
          <div>
            <div className="glass-panel rounded-4xl p-6 md:p-8">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Repair Services</h1>
              <p className="mt-4 text-muted">
                Fast diagnostics, transparent pricing, and same-day turnaround for most common issues.
                We confirm quote and timeline before the repair starts.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {siteConfig.repairIssues.map((issue) => (
                <span
                  key={issue}
                  className="premium-card rounded-xl px-4 py-3 font-medium"
                >
                  {issue}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              {[
                "1. Quick check and issue diagnosis",
                "2. Clear quote before repair starts",
                "3. Most common fixes finished same day",
                "4. Warranty and after-care advice at pickup",
              ].map((step) => (
                <p key={step} className="premium-card rounded-xl px-4 py-3 text-sm">
                  {step}
                </p>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <p className="font-semibold">Ready to book?</p>
              <p className="mt-1 text-sm text-muted">Secure your slot online or send a quick WhatsApp message for a quote.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <GlowButton href="/book">Book Appointment</GlowButton>
                <Link
                  href={siteConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  WhatsApp Quote
                </Link>
              </div>
            </div>
            <QuoteForm />
          </div>
        </div>
      </div>
      <JsonLd
        id="service-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Phone and device repair",
          provider: {
            "@type": "LocalBusiness",
            name: siteConfig.name,
            url: siteConfig.domain,
          },
          areaServed: "Greenwich, London",
          serviceType: "Phone repair, battery replacement, charging port repair",
        }}
      />
      <JsonLd
        id="breadcrumb-repair"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Repair Services", path: "/repair-services" },
        ])}
      />
    </>
  );
}
