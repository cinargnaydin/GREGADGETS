import type { Metadata } from "next";
import Link from "next/link";
import QuoteForm from "@/components/site/QuoteForm";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import GlowButton from "@/components/ui/GlowButton";
import { getLeadFunnelHref, isLeadFunnelEnabled } from "@/lib/lead-funnel";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Find Us | Greenwich Gadgets",
  description: "Call, WhatsApp, or visit Greenwich Gadgets on Greenwich High Road.",
  path: "/contact",
});

export default function ContactPage() {
  const funnelHref = getLeadFunnelHref("/book");

  return (
    <div className="py-14 md:py-16">
      <div className="container-base grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <div className="glass-panel rounded-4xl p-6 md:p-8">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact & Find Us</h1>
            <p className="mt-3 text-muted">
              Visit us in Greenwich Town Centre or send a quick quote request. For urgent help, call
              or WhatsApp directly. Walk-ins are welcome.
            </p>
          </div>
          <div className="premium-card rounded-2xl p-5">
            <p className="font-semibold">Address</p>
            <p className="mt-1 text-sm text-muted">
              {siteConfig.address.line1}, {siteConfig.address.city} {siteConfig.address.area}
            </p>
          </div>
          <div className="premium-card rounded-2xl p-5">
            <p className="font-semibold">Phone</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>
                <Link href={siteConfig.contact.phoneHref} className="hover:text-foreground transition-colors">
                  {siteConfig.contact.phoneDisplay}
                </Link>
              </li>
              <li>
                <Link href={siteConfig.contact.phone2Href} className="hover:text-foreground transition-colors">
                  {siteConfig.contact.phone2Display}
                </Link>
              </li>
            </ul>
          </div>
          <div className="premium-card rounded-2xl p-5">
            <p className="font-semibold">Opening Hours</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {siteConfig.hours.map((item) => (
                <li key={item.day}>
                  {item.day}: {item.hours}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={siteConfig.contact.phoneHref} className="glass-panel rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              Call {siteConfig.contact.phoneDisplay}
            </Link>
            <Link href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 hover:bg-brand-red-dark">
              WhatsApp
            </Link>
            <Link href={siteConfig.contact.mapsHref} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              Directions
            </Link>
          </div>
        </div>
        {isLeadFunnelEnabled ? (
          <div className="glass-panel h-fit rounded-3xl p-6">
            <h2 className="text-2xl font-bold tracking-tight">Start a repair request</h2>
            <p className="mt-2 text-sm text-muted">
              Tell us your issue and choose how you would like us to help — book a repair slot, get a WhatsApp quote, or request a callback.
            </p>
            <div className="mt-5">
              <GlowButton href={funnelHref}>Get Quote / Book Repair</GlowButton>
            </div>
          </div>
        ) : (
          <QuoteForm />
        )}
      </div>
      <JsonLd
        id="localbusiness-contact"
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: siteConfig.name,
          telephone: [siteConfig.contact.phoneDisplay, siteConfig.contact.phone2Display],
          email: siteConfig.contact.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.line1,
            addressLocality: siteConfig.address.city,
            postalCode: siteConfig.address.area,
            addressCountry: siteConfig.address.country,
          },
          openingHoursSpecification: siteConfig.hours.map((item) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: item.day,
            opens: item.hours.split(" - ")[0],
            closes: item.hours.split(" - ")[1],
          })),
        }}
      />
      <JsonLd
        id="breadcrumb-contact"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </div>
  );
}
