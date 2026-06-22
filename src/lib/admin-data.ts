// Mock data for the admin dashboard. Replace with a real API.

export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Pending"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  op: string;
  product: string;
  date: string;
  total: string;
  status: OrderStatus;
}

export const ORDERS: Order[] = [
  { id: "#AP-28411", customer: "Carter Vineyards", op: "Carter Family Estate", product: "Prevent · Restore", date: "Jun 18", total: "$548", status: "Processing" },
  { id: "#AP-28410", customer: "Sunridge Orchards", op: "Sunridge LLC", product: "Boost ×2", date: "Jun 18", total: "$538", status: "Shipped" },
  { id: "#AP-28409", customer: "Del Rio Farms", op: "Del Rio Produce", product: "Grow · Strength", date: "Jun 17", total: "$468", status: "Delivered" },
  { id: "#AP-28408", customer: "Brookside Berry Co.", op: "Brookside Inc.", product: "Boost · Prevent", date: "Jun 17", total: "$568", status: "Processing" },
  { id: "#AP-28407", customer: "Maple Hill Acres", op: "Maple Hill", product: "Restore ×1", date: "Jun 16", total: "$249", status: "Pending" },
  { id: "#AP-28406", customer: "Verde Valley Co-op", op: "Verde Co-op", product: "Cleanse · Grow", date: "Jun 16", total: "$448", status: "Delivered" },
  { id: "#AP-28405", customer: "Highland Cattle & Crop", op: "Highland Ag", product: "Protect ×2", date: "Jun 15", total: "$558", status: "Shipped" },
  { id: "#AP-28404", customer: "Willow Creek Greens", op: "Willow Creek", product: "Strength · Grow", date: "Jun 15", total: "$468", status: "Cancelled" },
  { id: "#AP-28403", customer: "Goldfield Almonds", op: "Goldfield Nut Co.", product: "Boost · Restore", date: "Jun 14", total: "$518", status: "Delivered" },
  { id: "#AP-28402", customer: "Cedar Ridge Vines", op: "Cedar Ridge", product: "Prevent ×1", date: "Jun 14", total: "$299", status: "Delivered" },
];

export interface Customer {
  name: string;
  op: string;
  location: string;
  crop: string;
  orders: number;
  ltv: string;
  avColor: string;
}

export const CUSTOMERS: Customer[] = [
  { name: "Elena Carter", op: "Carter Vineyards", location: "Napa, CA", crop: "Wine grapes", orders: 14, ltv: "$8,240", avColor: "#4E8A3A" },
  { name: "Tom Sunridge", op: "Sunridge Orchards", location: "Yakima, WA", crop: "Apples", orders: 11, ltv: "$6,910", avColor: "#B8860B" },
  { name: "Maria Del Rio", op: "Del Rio Farms", location: "Salinas, CA", crop: "Lettuce", orders: 9, ltv: "$5,120", avColor: "#2F6FB0" },
  { name: "Jonas Brook", op: "Brookside Berry Co.", location: "Hood River, OR", crop: "Strawberries", orders: 8, ltv: "$4,880", avColor: "#C0531C" },
  { name: "Priya Anand", op: "Maple Hill Acres", location: "Lodi, CA", crop: "Almonds", orders: 7, ltv: "$3,940", avColor: "#6E4FA0" },
  { name: "Greg Verde", op: "Verde Valley Co-op", location: "Mesa, AZ", crop: "Citrus", orders: 6, ltv: "$3,310", avColor: "#356A26" },
  { name: "Hana Kim", op: "Willow Creek Greens", location: "Eugene, OR", crop: "Greenhouse veg", orders: 5, ltv: "$2,680", avColor: "#5BA03C" },
  { name: "Sam Goldfield", op: "Goldfield Almonds", location: "Modesto, CA", crop: "Almonds", orders: 5, ltv: "$2,540", avColor: "#BE8A1E" },
];

export interface Kpi {
  label: string;
  value: string;
  trend: string;
}
export const KPIS: Kpi[] = [
  { label: "Revenue", value: "$284,920", trend: "▲ 12.4%" },
  { label: "Orders", value: "1,284", trend: "▲ 8.1%" },
  { label: "Avg. order", value: "$221", trend: "▲ 3.2%" },
  { label: "Customers", value: "1,412", trend: "▲ 5.6%" },
];

export const REVENUE_TOTAL = "$284,920";
export const REVENUE_MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const REVENUE_VALUES = [42, 48, 45, 53, 58, 55, 64, 69, 66, 74, 81, 88];

export interface CategorySplit {
  label: string;
  pct: number;
  color: string;
}
export const CATEGORY_SPLIT: CategorySplit[] = [
  { label: "Nutrients (Grow, Boost, Strength)", pct: 46, color: "#6FAE52" },
  { label: "Protection (Protect, Prevent)", pct: 29, color: "#C0531C" },
  { label: "Soil (Restore, Cleanse)", pct: 25, color: "#BE8A1E" },
];

// Inventory levels used by the dashboard (intentionally shows low-stock SKUs).
export const INVENTORY: Record<string, { stock: number; cap: number }> = {
  restore: { stock: 142, cap: 200 },
  cleanse: { stock: 88, cap: 200 },
  strength: { stock: 121, cap: 200 },
  grow: { stock: 167, cap: 200 },
  protect: { stock: 34, cap: 200 },
  prevent: { stock: 18, cap: 200 },
  boost: { stock: 134, cap: 200 },
};

export const stockColor = (stock: number) =>
  stock < 40 ? "#B23A1E" : stock < 90 ? "#C97A06" : "#538B3C";

const STATUS_FG: Record<OrderStatus, string> = {
  Processing: "#2F6FB0",
  Shipped: "#538B3C",
  Delivered: "#356A26",
  Pending: "#C97A06",
  Cancelled: "#B23A1E",
};
const STATUS_BG: Record<OrderStatus, string> = {
  Processing: "#E2ECF5",
  Shipped: "#E9F0E0",
  Delivered: "#E9F0E0",
  Pending: "#FBEFD9",
  Cancelled: "#F8E3DC",
};
export const statusStyle = (s: OrderStatus) => ({
  color: STATUS_FG[s],
  background: STATUS_BG[s],
});

export const ORDER_TABS: ("All" | OrderStatus)[] = [
  "All", "Processing", "Shipped", "Delivered", "Pending",
];
