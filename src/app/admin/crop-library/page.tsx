import CropLibrary from "@/components/admin/CropLibrary";
import { listCropFormulaCrops, listCropRemedies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function CropLibraryPage({ searchParams }: { searchParams: { crop?: string } }) {
  const remedies = listCropRemedies().map((r) => r.remedy);
  return <CropLibrary crops={listCropFormulaCrops()} remedies={remedies} initialCrop={searchParams.crop ?? ""} />;
}
