import SeoManager from "@/components/admin/SeoManager";
import { getSeoConfig } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  return <SeoManager initial={await getSeoConfig()} />;
}
