import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import { listProducts, resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/how-it-works");
}

export default function HowItWorksPage() {
  return <HowItWorks products={listProducts()} />;
}
