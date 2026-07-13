import type { Metadata } from "next";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us | Greenwich Gadgets",
  description: "Local team, honest support, and fast practical repair service in Greenwich.",
  path: "/about",
});

export default function AboutPage() {
  const bookingHref = "/book";

  return (
    <div className="py-14 md:py-16">
      <div className="container-base max-w-4xl">
        <div className="glass-panel rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About Greenwich Gadgets</h1>
          <p className="mt-4 text-muted">
            We are a local Greenwich shop focused on practical solutions: fast repair, fair advice,
            and useful everyday products. Customers repeatedly mention friendly support, transparent
            pricing, and clear communication.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Honest Advice", "No hard-sell process. We explain options clearly."],
            ["Fast Practical Fixes", "Most common issues are handled the same day."],
            ["Community First", "Built for Greenwich residents and repeat customers."],
          ].map(([title, text]) => (
            <article key={title} className="premium-card rounded-2xl p-5">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlowButton href={bookingHref}>Book a Repair</GlowButton>
          <Link
            href="/contact"
            className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
