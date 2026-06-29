import type { Metadata } from "next";
import WhyChooseUsV3 from "@/components/whychooseus/WhyChooseUsV3";
import { resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/why-choose-us");
}

export default function WhyChooseUsPage() {
  return <WhyChooseUsV3 />;
}
