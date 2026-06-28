import type { Metadata } from "next";
import ResearchStudies from "@/components/resources/ResearchStudies";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agrohomeopathy Research & Evidence | AgriPure",
  description:
    "A grower's evidence review of ultra-high-dilution (agrohomeopathy) crop inputs — peer-reviewed studies on residue-free crop protection, plant vitality, and organic-system fit, with an honest look at the debate and a split-field trial protocol.",
};

export default function ResearchStudiesPage() {
  return <ResearchStudies />;
}
