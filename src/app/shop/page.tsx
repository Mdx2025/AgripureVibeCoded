import type { Metadata } from "next";
import { listProducts, getPricingProgram, resolveSeoMetadata } from "@/lib/repo";
import { bundleQuote, floorRate } from "@/lib/pricing";
import ShopExperienceA from "@/components/shop/ShopExperienceA";
import ShopExperienceB from "@/components/shop/ShopExperienceB";
import ShopExperienceC from "@/components/shop/ShopExperienceC";
import ShopVariationSwitcher from "@/components/shop/ShopVariationSwitcher";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/shop");
}

export default function ShopPage({ searchParams }: { searchParams?: { v?: string } }) {
  const products = listProducts();
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));
  const floor = floorRate(program);

  const raw = searchParams?.v;
  const v = raw === "2" || raw === "3" ? raw : "1";
  const View = v === "2" ? ShopExperienceB : v === "3" ? ShopExperienceC : ShopExperienceA;

  return (
    <>
      <View products={products} bundles={bundles} floor={floor} />
      <ShopVariationSwitcher current={v} />
    </>
  );
}
