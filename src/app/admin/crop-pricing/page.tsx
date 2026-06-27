import CropPricingTable from "@/components/admin/CropPricingTable";
import { CROP_PRICING, PRICING_PARAMS } from "@/lib/crop-pricing";

export const dynamic = "force-dynamic";

export default function AdminCropPricingPage() {
  return <CropPricingTable crops={CROP_PRICING} params={PRICING_PARAMS} />;
}
