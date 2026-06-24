import type { Metadata } from "next";
import HowItWorksV3 from "@/components/howitworks/HowItWorksV3";
import { listProducts, resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/how-it-works");
}

export default function HowItWorksPage() {
  return <HowItWorksV3 products={listProducts()} />;
}
