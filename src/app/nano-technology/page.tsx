import type { Metadata } from "next";
import NanoTechV3 from "@/components/nanotech/NanoTechV3";
import { resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return resolveSeoMetadata("/nano-technology");
}

export default function NanoTechnologyPage() {
  return <NanoTechV3 />;
}
