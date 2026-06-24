import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, listProducts, getPricingProgram, resolveProductMetadata } from "@/lib/repo";
import { bundleQuote } from "@/lib/pricing";
import ProductSales from "@/components/product/ProductSales";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProduct(params.id);
  if (!product) return {};
  return resolveProductMetadata(product);
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  const others = listProducts().filter((p) => p.id !== product.id);
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));
  return <ProductSales product={product} related={others} bundles={bundles} />;
}
