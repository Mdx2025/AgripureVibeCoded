import type { Metadata } from "next";
import SubsidiesGuide from "@/components/resources/SubsidiesGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Farm Cost-Share Programs for Natural Pesticides & Biological Inputs | AgriPure Guide",
  description:
    "A plain-English guide to USDA EQIP, the Organic Initiative, OCCSP, SARE, and state programs that can help farmers offset the cost of natural pest control and biological nutrient inputs like AgriPure's.",
};

export default function SubsidiesPage() {
  return <SubsidiesGuide />;
}
