import Link from "next/link";
import Image from "next/image";
import GlowButton from "@/components/ui/GlowButton";
import { navLinks } from "@/content/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="container-base flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center font-bold">
          <Image
            src="/images/logo.png"
            alt="Greenwich Gadgets"
            width={200}
            height={46}
            className="h-14 w-auto md:h-16"
            priority
          />
        </Link>
        <nav className="glass-panel hidden items-center gap-5 rounded-full px-6 py-2 text-sm text-muted md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <GlowButton href="/contact">Get Quote</GlowButton>
      </div>
    </header>
  );
}
