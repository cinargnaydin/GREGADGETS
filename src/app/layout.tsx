import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import MobileStickyCta from "@/components/site/MobileStickyCta";
import { siteConfig } from "@/content/site";
import { Analytics } from "@vercel/analytics/react";
import { buildMetadata } from "@/lib/seo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <MobileStickyCta />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
