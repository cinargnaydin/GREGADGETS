import Link from "next/link";
import { siteConfig } from "@/content/site";

export default function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-3 z-30 px-4 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur">
        <Link href={siteConfig.contact.phoneHref} className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
          Call
        </Link>
        <Link href={siteConfig.contact.whatsappHref} target="_blank" className="rounded-xl bg-brand-red px-3 py-2 text-center text-xs font-semibold text-white shadow-glow">
          WhatsApp
        </Link>
        <Link href={siteConfig.contact.mapsHref} target="_blank" className="rounded-xl border border-black/10 px-3 py-2 text-center text-xs font-semibold">
          Map
        </Link>
      </div>
    </div>
  );
}
