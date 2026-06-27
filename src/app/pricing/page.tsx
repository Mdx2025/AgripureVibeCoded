import type { Metadata } from "next";
import PricingExplorer from "@/components/pricing/PricingExplorer";
import { resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/pricing");
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-container px-6 pb-[96px] pt-14 sm:px-8">
      <PricingExplorer />
    </div>
  );
}
