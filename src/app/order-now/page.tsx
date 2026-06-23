import type { Metadata } from "next";
import OrderWizard from "@/components/order/OrderWizard";
import { getPricingProgram } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Now — AgriPure",
  description: "Build a custom AgriPure program for your crops and get an instant per-acre quote.",
};

export default function OrderNowPage() {
  return <OrderWizard soilSamplePrice={getPricingProgram().soilSamplePrice} />;
}
