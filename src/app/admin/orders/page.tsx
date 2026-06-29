import OrdersTable from "@/components/admin/OrdersTable";
import { listOrders } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  return <OrdersTable orders={await listOrders()} />;
}
