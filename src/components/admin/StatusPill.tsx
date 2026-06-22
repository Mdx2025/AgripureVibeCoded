import { type OrderStatus, statusStyle } from "@/lib/admin-data";

export default function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-[5px] text-xs font-bold"
      style={statusStyle(status)}
    >
      {status}
    </span>
  );
}
