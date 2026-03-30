import Link from "next/link";
import GlowButton from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <div className="container-base py-20">
      <div className="glass-panel mx-auto max-w-3xl rounded-4xl p-8 text-center md:p-10">
        <p className="text-sm font-semibold text-brand-red">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted">The page may have moved or no longer exists.</p>
        <div className="mt-6 flex justify-center gap-3">
          <GlowButton href="/">Back to Home</GlowButton>
          <Link href="/contact" className="glass-panel rounded-full px-5 py-3 text-sm font-semibold">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
