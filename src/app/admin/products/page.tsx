import ProductsManager from "@/components/admin/ProductsManager";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return <ProductsManager products={listProducts()} />;
}
