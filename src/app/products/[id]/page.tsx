import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, listProducts, getPricingProgram, resolveProductMetadata } from "@/lib/repo";
import { bundleQuote } from "@/lib/pricing";
import ProductSales from "@/components/product/ProductSales";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return {};
  return resolveProductMetadata(product);
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  const others = (await listProducts()).filter((p) => p.id !== product.id);
  const program = await getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));
  return <ProductSales product={product} related={others} bundles={bundles} />;
}
