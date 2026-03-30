import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/repair-services",
    "/buy-sell",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.domain}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
    lastModified: new Date(),
  }));
}
