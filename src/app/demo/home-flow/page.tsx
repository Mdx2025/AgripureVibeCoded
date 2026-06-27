import Link from "next/link";
import ProductFlowFullscreen from "@/components/home/ProductFlowFullscreen";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Demo · Full-screen product flow — AgriPure",
  robots: { index: false, follow: false },
};

/**
 * Preview-only demo of the new full-screen step-by-step product flow.
 * Not linked in nav and noindexed. Once approved, this layout replaces the
 * guided-rail flow on the homepage.
 */
export default function HomeFlowDemoPage() {
  const products = listProducts();
  return (
    <div>
      <div className="sticky top-[74px] z-30 flex items-center justify-center gap-3 border-b border-[#D9D6C7] bg-[#FBEFD9] px-4 py-2 text-[13px] font-semibold text-[#8a5a14]">
        <span className="rounded-full bg-[#C97A06] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">Demo</span>
        Preview of the new full-screen product flow — not yet live on the homepage.
        <Link href="/" className="ap-link !text-[#8a5a14] underline">View current homepage</Link>
      </div>
      <ProductFlowFullscreen products={products} />
    </div>
  );
}
