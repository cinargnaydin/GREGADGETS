import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms | Greenwich Gadgets",
  description: "General service and sales terms for Greenwich Gadgets.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="py-14 md:py-16">
      <div className="container-base max-w-4xl space-y-4">
        <div className="glass-panel rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Terms</h1>
          <p className="mt-4 text-muted">
            Repair timing and parts availability vary by model and issue severity. Final pricing is
            confirmed after diagnostics.
          </p>
          <p className="mt-3 text-muted">
            Product stock and in-store offers may change without notice. Warranty and return terms
            are explained at point of sale.
          </p>
        </div>
      </div>
    </div>
  );
}
