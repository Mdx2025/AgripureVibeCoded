import { AdminsManager } from "@/components/admin/managers";
import { listAdmins } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function AdminsPage() {
  return <AdminsManager initial={listAdmins()} />;
}
