import CropLibrary from "@/components/admin/CropLibrary";
import { listCropFormulaCrops, listCropRemedies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function CropLibraryPage({ searchParams }: { searchParams: { crop?: string } }) {
  const remedies = (await listCropRemedies()).map((r) => r.remedy);
  return <CropLibrary crops={await listCropFormulaCrops()} remedies={remedies} initialCrop={searchParams.crop ?? ""} />;
}
