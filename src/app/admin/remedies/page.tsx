import CropRemediesView from "@/components/admin/CropRemediesView";
import { listCropRemedies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function RemediesPage() {
  return <CropRemediesView remedies={listCropRemedies()} />;
}
