import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy | Greenwich Gadgets",
  description: "Cookie usage and analytics preferences for this website.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <div className="py-14 md:py-16">
      <div className="container-base max-w-4xl space-y-4">
        <div className="glass-panel rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Cookie Policy</h1>
          <p className="mt-4 text-muted">
            This website uses essential cookies for core functionality and analytics cookies to
            understand performance and improve user experience.
          </p>
          <p className="mt-3 text-muted">
            You can manage browser settings to limit cookies. Some features may work differently when
            cookies are disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
