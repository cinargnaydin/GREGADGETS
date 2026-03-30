import Link from "next/link";
import { siteConfig } from "@/content/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/80 backdrop-blur">
      <div className="container-base flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted">
        <p>© {new Date().getFullYear()} {siteConfig.name}. Precision service for Greenwich locals.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="/cookie-policy" className="transition-colors hover:text-foreground">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
