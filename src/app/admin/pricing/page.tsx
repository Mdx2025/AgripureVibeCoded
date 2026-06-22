import PricingManager from "@/components/admin/PricingManager";
import { getPricingProgram } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function AdminPricingPage() {
  return <PricingManager initial={getPricingProgram()} />;
}
