import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeadFunnel from "@/components/site/LeadFunnel";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Lead Funnel Preview | Greenwich Gadgets",
    description: "Internal preview for the Greenwich Gadgets lead funnel.",
    path: "/lead-funnel-preview",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadFunnelPreviewPage() {
  const previewAllowed =
    process.env.NODE_ENV !== "production" ||
    process.env.LEAD_FUNNEL_PREVIEW_ENABLED === "true";

  if (!previewAllowed) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <LeadFunnel sourcePage="lead-funnel-preview" heading="How can we help with your repair?" />
    </div>
  );
}
