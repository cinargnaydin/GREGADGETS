import type { Metadata } from "next";
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
      </div>
    </div>
  );
}
