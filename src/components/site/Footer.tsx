import Link from "next/link";
import { siteConfig } from "@/content/site";
import { getLeadFunnelHref } from "@/lib/lead-funnel";

const baseServiceLinks = [
  { href: "/repair-services", label: "Repairs" },
  { href: "/buy-sell", label: "Buy/Sell" },
  { href: "/shop", label: "Shop" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Book Now" },
];

export default function Footer() {
  const serviceLinks = baseServiceLinks.map((link) =>
    link.href === "/book" ? { ...link, href: getLeadFunnelHref("/book") } : link
  );

  return (
    <footer className="mt-20 border-t border-black/10 bg-white/80 backdrop-blur">
      <div className="container-base py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/8 pb-5 text-sm text-muted">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {serviceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href={siteConfig.contact.phoneHref} className="transition-colors hover:text-foreground">
              {siteConfig.contact.phoneDisplay}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Find Us
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 text-sm text-muted">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Precision service for Greenwich locals.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
