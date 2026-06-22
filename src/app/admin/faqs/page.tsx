import { FaqsManager } from "@/components/admin/managers";
import { listFaqs } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function FaqsPage() {
  return <FaqsManager initial={listFaqs()} />;
}
