import type { Metadata } from "next";
import { listProducts, getPricingProgram, resolveSeoMetadata } from "@/lib/repo";
import { bundleQuote } from "@/lib/pricing";
import ShopExperienceA from "@/components/shop/ShopExperienceA";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/shop");
}

export default function ShopPage() {
  const products = listProducts();
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));

  return <ShopExperienceA products={products} bundles={bundles} />;
}
