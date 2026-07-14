import type { Metadata } from "next";
import Image from "next/image";
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

        {/* Shop interior photos */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel relative h-64 overflow-hidden rounded-3xl p-2 md:h-80">
            <Image
              src="/images/shopinterior3.jpg"
              alt="Inside Greenwich Gadgets — accessories, audio, and gifts on display"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="rounded-2xl object-cover"
            />
          </div>
          <div className="glass-panel relative h-64 overflow-hidden rounded-3xl p-2 md:h-80">
            <Image
              src="/images/shopinterior4.jpg"
              alt="Inside Greenwich Gadgets — gaming consoles, controllers, phone accessories, and travel luggage"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {[
            ["Cases & Protectors", "Tempered glass and durable protection options.", "lg:col-span-2"],
            ["Chargers & Cables", "Reliable charging accessories for daily use.", "lg:col-span-2"],
            ["Audio Accessories", "Earphones and practical audio add-ons.", "lg:col-span-2"],
            ["Perfumes", "Popular fragrance options mentioned by local customers.", "lg:col-span-3"],
            ["Gifts", "Small useful gadgets and gift-ready items.", "md:col-span-2 lg:col-span-3"],
          ].map(([title, text, span]) => (
            <article key={title} className={`premium-card rounded-2xl p-5 ${span}`}>
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
