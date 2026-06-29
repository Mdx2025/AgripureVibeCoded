import PricingManager from "@/components/admin/PricingManager";
import { getPricingProgram } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  return <PricingManager initial={await getPricingProgram()} />;
}
