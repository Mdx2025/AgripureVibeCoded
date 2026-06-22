import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, listProducts, getPricingProgram } from "@/lib/repo";
import { relatedFrom } from "@/lib/products";
import { bundleQuote } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  const related = relatedFrom(listProducts(), product);
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));
  return <ProductDetail product={product} related={related} bundles={bundles} />;
}
