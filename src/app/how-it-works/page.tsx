import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import HowItWorksV2 from "@/components/howitworks/HowItWorksV2";
import VariationSwitcher from "@/components/ui/VariationSwitcher";
import { listProducts, resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/how-it-works");
}

const OPTIONS = [
  { v: "1", name: "Guided" },
  { v: "2", name: "Cinematic" },
];

export default function HowItWorksPage({ searchParams }: { searchParams?: { v?: string } }) {
  const products = listProducts();
  const v = searchParams?.v === "2" ? "2" : "1";
  return (
    <>
      {v === "2" ? <HowItWorksV2 products={products} /> : <HowItWorks products={products} />}
      <VariationSwitcher current={v} options={OPTIONS} label="How it works" />
    </>
  );
}
