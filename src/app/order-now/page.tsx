import type { Metadata } from "next";
import OrderWizard from "@/components/order/OrderWizard";

export const metadata: Metadata = {
  title: "Order Now — AgriPure",
  description: "Build a custom AgriPure program for your crops and get an instant per-acre quote.",
};

export default function OrderNowPage() {
  return <OrderWizard />;
}
