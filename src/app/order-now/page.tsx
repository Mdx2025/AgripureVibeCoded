import type { Metadata } from "next";
import OrderWizard from "@/components/order/OrderWizard";
import { getPricingProgram, resolveSeoMetadata, getCropPriceOverrides } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/order-now");
}

export default function OrderNowPage() {
  return <OrderWizard soilSamplePrice={getPricingProgram().soilSamplePrice} priceOverrides={getCropPriceOverrides()} />;
}
