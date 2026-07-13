import type { Metadata } from "next";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

const faqs = [
  {
    q: "How long does a typical repair take?",
    a: "Many common repairs such as screen or battery replacement are completed the same day.",
  },
  {
    q: "Do I need to book before visiting?",
    a: "Walk-ins are welcome, but messaging ahead can speed up diagnostics and quote response.",
  },
  {
    q: "Is my data safe during repair?",
    a: "We aim to preserve data whenever possible and advise backup steps before major repairs.",
  },
  {
    q: "Do you provide accessories and other products?",
    a: "Yes, the store includes accessories, perfumes, gifts, and other lifestyle products.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "FAQ | Greenwich Gadgets",
  description: "Frequently asked questions about repairs, timings, and support.",
  path: "/faq",
});

export default function FaqPage() {
  const bookingHref = "/book";

  return (
    <div className="py-14 md:py-16">
      <div className="container-base max-w-4xl">
        <div className="glass-panel rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Frequently Asked Questions</h1>
        </div>
        <div className="mt-6 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="premium-card rounded-2xl p-5">
              <h2 className="text-lg font-semibold tracking-tight">{faq.q}</h2>
              <p className="mt-2 text-sm text-muted">{faq.a}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlowButton href={bookingHref}>Book Now</GlowButton>
          <Link
            href="/contact"
            className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <JsonLd
        id="faq-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }}
      />
    </div>
  );
}
