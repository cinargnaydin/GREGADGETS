import type { Metadata } from "next";
import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";
import { siteConfig } from "@/content/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop | Greenwich Gadgets",
  description: "Accessories, perfumes, gifts, and in-store essentials at Greenwich Gadgets.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="py-14 md:py-16">
      <div className="container-base">
        <div className="glass-panel max-w-4xl rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Shop Highlights</h1>
          <p className="mt-4 max-w-3xl text-muted">
            Explore curated accessories and lifestyle picks in-store. Product stock can vary by day.
          </p>
        </div>

        {/* Shop interior photos — coming soon */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel flex h-64 items-center justify-center rounded-3xl p-2 md:h-80">
            <span className="text-sm font-semibold text-muted">Images coming soon</span>
          </div>
          <div className="glass-panel flex h-64 items-center justify-center rounded-3xl p-2 md:h-80">
            <span className="text-sm font-semibold text-muted">Images coming soon</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Cases & Protectors", "Tempered glass and durable protection options."],
            ["Chargers & Cables", "Reliable charging accessories for daily use."],
            ["Audio Accessories", "Earphones and practical audio add-ons."],
            ["Perfumes", "Popular fragrance options mentioned by local customers."],
            ["Puffs / Vapes", "Adult-only products. Age checks apply in-store."],
            ["Gifts", "Small useful gadgets and gift-ready items."],
          ].map(([title, text]) => (
            <article key={title} className="premium-card rounded-2xl p-5">
              <h2 className="text-lg font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlowButton href="/contact">Visit Us In-Store</GlowButton>
          <Link
            href={siteConfig.contact.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Get Directions
          </Link>
        </div>
      </div>
    </div>
  );
}
