import type { Metadata } from "next";
import PricingExplorer from "@/components/pricing/PricingExplorer";
import { resolveSeoMetadata, getCropPriceOverrides } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/pricing");
}

export default async function PricingPage() {
  return (
    <div className="mx-auto max-w-container px-6 pb-[96px] pt-14 sm:px-8">
      <PricingExplorer priceOverrides={await getCropPriceOverrides()} />
    </div>
  );
}
