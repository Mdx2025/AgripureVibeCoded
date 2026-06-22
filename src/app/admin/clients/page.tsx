import { ClientsManager } from "@/components/admin/managers";
import { listClients } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return <ClientsManager initial={listClients()} />;
}
