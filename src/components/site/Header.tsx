"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { navLinks } from "@/content/site";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="container-base flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center font-bold" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Greenwich Gadgets"
            width={200}
            height={46}
            className="h-14 w-auto md:h-16"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="glass-panel hidden items-center gap-5 rounded-full px-6 py-2 text-sm text-muted md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <GlowButton href="/book">Book Now</GlowButton>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="container-base flex flex-col gap-1 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-black/5 hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 px-4">
              <GlowButton href="/book" className="w-full justify-center">
                Book Now
              </GlowButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
