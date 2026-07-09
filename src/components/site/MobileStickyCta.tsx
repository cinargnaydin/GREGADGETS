"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/site";
import { isLeadFunnelEnabled, LEAD_FUNNEL_PATH } from "@/lib/lead-funnel";

// Routes that are already part of the booking flow. The sticky "Get Quote"
// bar is redundant here and would overlap the primary action button on mobile.
const BOOKING_FLOW_ROUTES = [LEAD_FUNNEL_PATH, "/lead-funnel-preview", "/book"];

export default function MobileStickyCta() {
  const pathname = usePathname();

  if (pathname && BOOKING_FLOW_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  if (isLeadFunnelEnabled) {
    return (
      <div className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 px-4 md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur">
          <Link href={siteConfig.contact.phoneHref} className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
            Call
          </Link>
          <Link href={LEAD_FUNNEL_PATH} className="rounded-xl bg-brand-red px-3 py-2 text-center text-xs font-semibold text-white shadow-glow">
            Get Quote
          </Link>
          <Link href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
            WhatsApp
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 px-4 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur">
        <Link href={siteConfig.contact.phoneHref} className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
          Call
        </Link>
        <Link href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-brand-red px-3 py-2 text-center text-xs font-semibold text-white shadow-glow">
          WhatsApp
        </Link>
        <Link href={siteConfig.contact.mapsHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
          Map
        </Link>
      </div>
    </div>
  );
}
