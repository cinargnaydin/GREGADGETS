import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeadFunnel from "@/components/site/LeadFunnel";
import { buildMetadata } from "@/lib/seo";
import { isLeadFunnelEnabled } from "@/lib/lead-funnel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Get a Quote or Book Repair | Greenwich Gadgets",
  description: "Start a repair request with Greenwich Gadgets.",
  path: "/get-started",
});

export default function GetStartedPage() {
  if (!isLeadFunnelEnabled && process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <LeadFunnel sourcePage="get-started" />
    </div>
  );
}
