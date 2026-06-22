import OrdersTable from "@/components/admin/OrdersTable";
import { listOrders } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  return <OrdersTable orders={listOrders()} />;
}
