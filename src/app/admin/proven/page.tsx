import { ProvenManager } from "@/components/admin/managers";
import { listProven } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function ProvenPage() {
  return <ProvenManager initial={listProven()} />;
}
