import type { Metadata } from "next";
import OrderWizard from "@/components/order/OrderWizard";
import { getPricingProgram, resolveSeoMetadata, getCropPriceOverrides } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/order-now");
}

export default async function OrderNowPage() {
  return <OrderWizard soilSamplePrice={(await getPricingProgram()).soilSamplePrice} priceOverrides={await getCropPriceOverrides()} />;
}
