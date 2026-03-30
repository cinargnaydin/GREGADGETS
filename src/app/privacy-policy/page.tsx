import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Greenwich Gadgets",
  description: "How Greenwich Gadgets handles personal data for service requests.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="py-14 md:py-16">
      <div className="container-base max-w-4xl space-y-4">
        <div className="glass-panel rounded-4xl p-6 md:p-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-muted">
            We collect only the contact and device information required to respond to your repair or
            product inquiry. We do not sell personal data to third parties.
          </p>
          <p className="mt-3 text-muted">
            Data submitted through forms is used for customer communication and support operations.
            You may request deletion or correction via email.
          </p>
        </div>
      </div>
    </div>
  );
}
