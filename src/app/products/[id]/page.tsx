import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, listProducts, getPricingProgram, resolveProductMetadata } from "@/lib/repo";
import { relatedFrom } from "@/lib/products";
import { bundleQuote } from "@/lib/pricing";
import ProductSalesA from "@/components/product/ProductSalesA";
import ProductSalesB from "@/components/product/ProductSalesB";
import ProductSalesC from "@/components/product/ProductSalesC";
import VariationSwitcher from "@/components/product/VariationSwitcher";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProduct(params.id);
  if (!product) return {};
  return resolveProductMetadata(product);
}

export default function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { v?: string };
}) {
  const product = getProduct(params.id);
  if (!product) notFound();
  const related = relatedFrom(listProducts(), product);
  const program = getPricingProgram();
  const bundles = program.bundles.map((b) => bundleQuote(b, program));

  const v = searchParams?.v === "2" ? "2" : searchParams?.v === "3" ? "3" : "1";
  const View = v === "2" ? ProductSalesB : v === "3" ? ProductSalesC : ProductSalesA;

  return (
    <>
      <View product={product} related={related} bundles={bundles} />
      <VariationSwitcher current={v} />
    </>
  );
}
