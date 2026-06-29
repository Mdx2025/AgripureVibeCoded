import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { resolveSeoMetadata } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeoMetadata("/contact");
}

const inputCls =
  "rounded-[10px] border border-[#D9D6C7] px-[15px] py-[13px] text-[15px] outline-none focus:border-leaf";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-8 pb-[90px] pt-14">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">
            Talk to an agronomist
          </div>
          <h1 className="mt-2 font-display text-[48px] font-black tracking-[-0.02em] text-forest">
            Let&apos;s build your program.
          </h1>
          <p className="mt-3.5 text-[17px] text-fg2">
            Tell us what you&apos;re growing and what you&apos;re up against this season.
            We&apos;ll get back within one business day.
          </p>
          <div className="mt-[34px] flex flex-col gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#E9F0E0] text-leaf-700">
                <Mail size={20} strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-bold text-forest">Sales &amp; formulation</div>
                <div className="text-sm text-[#7A8076]">grow@agripure.com · (800) 555-0142</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#E9F0E0] text-leaf-700">
                <MapPin size={20} strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-bold text-forest">Field office</div>
                <div className="text-sm text-[#7A8076]">1820 Vineyard Rd, Napa, CA 94558</div>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-[20px] border border-hair bg-white p-[30px] shadow-g-md">
          <div className="grid grid-cols-2 gap-3.5">
            <input placeholder="First name" className={inputCls} />
            <input placeholder="Last name" className={inputCls} />
            <input placeholder="Email" className={`col-span-2 ${inputCls}`} />
            <input placeholder="Crop & acreage" className={`col-span-2 ${inputCls}`} />
            <textarea
              placeholder="What are you fighting this season?"
              rows={4}
              className={`col-span-2 resize-y ${inputCls}`}
            />
          </div>
          <button type="button" className="btn-primary mt-4 h-[52px] w-full text-base">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
