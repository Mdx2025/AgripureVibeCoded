import { ProvenManager } from "@/components/admin/managers";
import { listProven } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function ProvenPage() {
  return <ProvenManager initial={await listProven()} />;
}
