import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata({ title, description, path = "/" }: MetaInput): Metadata {
  const canonical = new URL(path, siteConfig.domain).toString();
  return {
    metadataBase: new URL(siteConfig.domain),
    title,
    description,
    alternates: { canonical },
    icons: {
      icon: [{ url: "/images/logo.png", type: "image/png" }],
      shortcut: ["/images/logo.png"],
      apple: [{ url: "/images/logo.png", type: "image/png" }],
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_GB",
      type: "website",
      images: ["/images/shopexterior.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/shopexterior.png"],
    },
  };
}
