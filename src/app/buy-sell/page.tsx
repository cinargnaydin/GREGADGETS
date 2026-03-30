import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Buy & Sell Phones | Greenwich Gadgets",
  description: "Trade in, buy, and sell devices with fair assessments in Greenwich.",
  path: "/buy-sell",
});

export default function BuySellPage() {
  return (
    <div className="py-14 md:py-16">
      <div className="container-base">
        <div className="glass-panel max-w-4xl rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Buy & Sell Phones</h1>
          <p className="mt-4 max-w-3xl text-muted">
            Bring your current device for on-the-spot assessment and transparent trade-in options.
            Stock includes new, refurbished, and pre-owned models.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Bring Device", "We inspect condition, battery, and essential functions."],
            ["Get Fair Offer", "Clear valuation with trade-in alternatives if relevant."],
            ["Transfer Support", "We can help move your data to your new device."],
          ].map(([title, text]) => (
            <article key={title} className="premium-card rounded-2xl p-5">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
