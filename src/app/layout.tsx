import type { Metadata } from "next";
import { Nunito, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { resolveSeoMetadata } from "@/lib/repo";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Site-wide default metadata (home entry) — editable in admin → SEO.
// Each page overrides this via its own generateMetadata.
export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/");
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${hanken.variable} ${jetbrains.variable} flex min-h-screen flex-col bg-paper text-ink`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
