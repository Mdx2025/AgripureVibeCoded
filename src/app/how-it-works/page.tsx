import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "How It Works — AgriPure",
  description:
    "From a custom, crop-specific formulation of all seven products, to precise fertigation dosing, to season-long application across the crop lifecycle — see the full AgriPure process.",
};

export default function HowItWorksPage() {
  return <HowItWorks products={listProducts()} />;
}
