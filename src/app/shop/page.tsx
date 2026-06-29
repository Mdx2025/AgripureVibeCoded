import type { Metadata } from "next";
import { listProducts, getPricingProgram, resolveSeoMetadata } from "@/lib/repo";
import { bundleQuote } from "@/lib/pricing";
import ShopExperienceA from "@/components/shop/ShopExperienceA";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/shop");
}

export default async function ShopPage() {
  const products = await listProducts();
  const program = await getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));

  return <ShopExperienceA products={products} bundles={bundles} />;
}
