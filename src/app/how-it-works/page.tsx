import type { Metadata } from "next";
import HowItWorksV3 from "@/components/howitworks/HowItWorksV3";
import { listProducts, resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/how-it-works");
}

export default async function HowItWorksPage() {
  return <HowItWorksV3 products={await listProducts()} />;
}
