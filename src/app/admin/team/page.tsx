import { TeamManager } from "@/components/admin/managers";
import { listTeam } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function TeamPage() {
  return <TeamManager initial={listTeam()} />;
}
