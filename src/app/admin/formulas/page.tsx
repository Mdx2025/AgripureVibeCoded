import CropFormulasView from "@/components/admin/CropFormulasView";
import { listAllCropFormulas, listCropFormulaCrops } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function FormulasPage() {
  // Ship only the displayed fields — the full blend recipe stays server-side / Crop Library.
  const formulas = (await listAllCropFormulas()).map((f) => ({
    id: f.id, crop: f.crop, line: f.line, line_code: f.line_code,
    primary_remedy: f.primary_remedy, potency: f.potency, targets: f.targets, rate: f.rate,
  }));
  const crops = (await listCropFormulaCrops()).map((c) => c.crop);
  return <CropFormulasView formulas={formulas} crops={crops} />;
}
