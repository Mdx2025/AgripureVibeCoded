import CropPricingTable from "@/components/admin/CropPricingTable";
import { PRICING_PARAMS } from "@/lib/crop-pricing";
import { loadCropPricing, getCropPriceOverrides } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function AdminCropPricingPage() {
  const crops = await loadCropPricing();
  const overrideIds = (await getCropPriceOverrides()).map((o) => o.id);
  return <CropPricingTable crops={crops} params={PRICING_PARAMS} overrideIds={overrideIds} />;
}
