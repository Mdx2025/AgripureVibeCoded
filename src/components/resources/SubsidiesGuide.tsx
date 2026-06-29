"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ChevronDown, ClipboardList, HandCoins,
  MapPin, ClipboardCheck, ListChecks, Receipt, BadgeDollarSign, ExternalLink, Sprout,
} from "lucide-react";

/* ─────────────────────────── data ─────────────────────────── */

const STEPS = [
  {
    Icon: Sprout,
    title: "You adopt a qualifying practice",
    body: "Things like integrated pest management (reducing chemical pesticide risk) or improved nutrient management. Biological and natural inputs fit these practices.",
  },
  {
    Icon: ClipboardList,
    title: "You apply through a cost-share program",
    body: "You enroll with your local USDA or state office and get an approved plan. Most programs reimburse a share of your costs rather than paying a store discount.",
  },
  {
    Icon: HandCoins,
    title: "You get reimbursed",
    body: "You typically buy and apply the inputs, keep your receipts and records, and receive your cost-share payment. Higher payment rates are often available for beginning, veteran, and historically underserved farmers.",
  },
];

interface Program {
  id: string;
  tag: string;
  name: string;
  oneLiner: string;
  offset: string;
  eligible: string;
  goodToKnow: string;
  apply?: string;
  button: { label: string; href: string };
}

const PROGRAMS: Program[] = [
  {
    id: "eqip",
    tag: "Federal · NRCS",
    name: "EQIP — Environmental Quality Incentives Program",
    oneLiner:
      "The biggest federal cost-share program — pays you to adopt conservation practices, including pest and nutrient management.",
    offset:
      "Costs tied to integrated pest management and nutrient management plans, where lower-risk biological inputs (like AgriPure products) fit. Practice standards include the Pest Management Conservation System (Code 595) and Nutrient Management (Code 590).",
    eligible:
      "Agricultural producers and owners of eligible farmland. Beginning, veteran, limited-resource, and socially disadvantaged farmers get higher payment rates and can request advance payments.",
    goodToKnow:
      "EQIP is a reimbursement-style cost-share contract — you generally pay up front and get cost-share back. Practice 595 mainly funds building and following an IPM plan that reduces pesticide risk; it doesn't simply pay for a product purchase, but moving to biological inputs supports that plan.",
    apply:
      "Contact your local NRCS office (USDA Service Center). Applications are accepted year-round but funded in ranked batches with periodic cutoff dates.",
    button: { label: "Apply through NRCS", href: "https://www.nrcs.usda.gov/programs-initiatives/environmental-quality-incentives-program" },
  },
  {
    id: "organic-initiative",
    tag: "Federal · NRCS",
    name: "EQIP Organic Initiative",
    oneLiner: "An EQIP track built specifically for certified-organic and transitioning-to-organic farms.",
    offset:
      "The same conservation practices as EQIP — pest management, nutrient management, cover crops, crop rotation — geared to organic systems where natural inputs are the norm.",
    eligible: "Certified organic producers and those transitioning to organic.",
    goodToKnow: "Same reimbursement model as EQIP. A strong fit if AgriPure products are part of your organic input program.",
    button: { label: "Learn about the Organic Initiative", href: "https://www.nrcs.usda.gov/programs-initiatives/eqip-organic-initiative" },
  },
  {
    id: "occsp",
    tag: "Federal · FSA",
    name: "OCCSP — Organic Certification Cost Share Program",
    oneLiner: "Reimburses a big chunk of what it costs to get and keep organic certification.",
    offset:
      "Up to 75% of your certification costs, capped at $750 per certification scope (scopes: crops, wild crops, livestock, processing/handling). With multiple scopes, total reimbursement can reach up to $3,000. (Figures as of 2025–2026, subject to change.)",
    eligible: "Certified organic operations (and those renewing certification).",
    goodToKnow:
      "This covers certification costs, not the inputs themselves — but it lowers the cost of running the organic operation where natural inputs are used. Apply through your local FSA office or participating state agency. 2025 fund release timing has been uncertain — confirm current availability with FSA.",
    button: { label: "Apply through FSA", href: "https://www.fsa.usda.gov/resources/programs/organic-certification-cost-share-program-occsp" },
  },
  {
    id: "sare",
    tag: "Federal · Competitive grant",
    name: "SARE Grants — Sustainable Agriculture Research & Education",
    oneLiner: "Competitive grants that can fund an on-farm trial of a new practice or input.",
    offset:
      "Farmer/Rancher grants let you test something new on your farm — for example, trialing a biological pesticide or natural nutrient program and measuring the results.",
    eligible:
      "Farmers and ranchers in every U.S. state and territory. Grant sizes vary by region (commonly a few thousand up to ~$30,000). (Figures as of 2025–2026, subject to change.)",
    goodToKnow:
      "This is a grant (not a reimbursement contract), but it's competitive and project-based — you propose a trial and report what you learn.",
    button: { label: "Explore SARE grants", href: "https://www.sare.org/grants/" },
  },
  {
    id: "state-local",
    tag: "State & local",
    name: "State & Local Programs",
    oneLiner:
      "Many states run their own IPM cost-share, healthy-soils, and block-grant programs — often the most direct way to offset input costs.",
    offset:
      "Varies widely by state: integrated pest management incentives, healthy-soils payments, organic transition funds, and more.",
    eligible: "Depends on the state program.",
    goodToKnow:
      "These vary the most and change often. Your state department of agriculture and local conservation district are the people to ask.",
    button: { label: "Find your state department of agriculture", href: "https://www.nasda.org/" },
  },
];

const PROFILES = [
  {
    label: "I run a conventional farm and want to cut chemical pesticide use.",
    rec: "Start with EQIP (Pest Management Conservation System, Code 595) at your local NRCS office. Ask about nutrient management (Code 590) too.",
    target: "eqip",
  },
  {
    label: "I'm certified organic (or transitioning).",
    rec: "Look at the EQIP Organic Initiative for practices, and OCCSP to recover certification costs.",
    target: "organic-initiative",
  },
  {
    label: "I want to test a new natural product before going all-in.",
    rec: "A SARE Farmer/Rancher grant can fund an on-farm trial.",
    target: "sare",
  },
  {
    label: "I want the fastest, most direct help with input costs.",
    rec: "Check your state and local programs first — call your state ag department and conservation district.",
    target: "state-local",
  },
];

const APPLY_STEPS = [
  { Icon: MapPin, title: "Find your local office", body: "For EQIP/Organic Initiative, that's your NRCS office at the USDA Service Center. For OCCSP, your FSA office or state agency." },
  { Icon: ClipboardCheck, title: "Talk through a conservation plan", body: "A conservationist helps you identify qualifying practices (e.g., IPM, nutrient management) for your land." },
  { Icon: ListChecks, title: "Get your application ranked and approved", body: "Programs fund applications in batches; ask about the next cutoff date." },
  { Icon: Sprout, title: "Choose your eligible inputs", body: "Within an approved pest- or nutrient-management practice, natural inputs like AgriPure's can be part of your plan. Confirm specifics with your planner." },
  { Icon: Receipt, title: "Buy, apply, and keep records", body: "Save receipts and application records — reimbursement depends on documentation." },
  { Icon: BadgeDollarSign, title: "Submit for reimbursement", body: "Receive your cost-share payment per your contract." },
];

const PRODUCT_FIT = [
  { plan: "Integrated Pest Management / reducing chemical pesticide risk (EQIP Code 595)", products: "Natural insecticides, fungicides, herbicides" },
  { plan: "Nutrient Management (EQIP Code 590)", products: "Biological / natural nutrient products" },
  { plan: "Organic systems (EQIP Organic Initiative, OCCSP)", products: "The full natural product line used in certified-organic production" },
];

const FAQS = [
  { q: "Does the government pay for AgriPure products directly?", a: "No program discounts a specific brand at the register. Programs reimburse you for adopting conservation practices, and natural inputs like AgriPure's can count toward those practices. You apply, get approved, and are reimbursed for an eligible share of your costs." },
  { q: "Is this a discount or a reimbursement?", a: "Mostly reimbursement. With cost-share programs like EQIP, you typically pay up front and receive cost-share back after meeting your plan. SARE is a project grant. OCCSP reimburses certification costs." },
  { q: "How much can I get back?", a: "It depends on the program, practice, and your state. OCCSP reimburses up to 75% of certification costs ($750 per scope, up to ~$3,000). EQIP payments vary by practice and producer; underserved producers receive higher rates. Ask your local office for your specific rates. (Figures as of 2025–2026, subject to change.)" },
  { q: "Do I have to be organic to qualify?", a: "No. EQIP serves conventional and organic farms. Organic-specific help (Organic Initiative, OCCSP) is a bonus if you're certified or transitioning." },
  { q: "Where do I actually apply?", a: "EQIP and the Organic Initiative: your local NRCS office. OCCSP: your FSA office or state agency. SARE: your regional SARE program. State programs: your state department of agriculture." },
  { q: "How long does it take?", a: "Programs fund applications in ranked batches with periodic cutoff dates, so timing varies. Apply early and ask your planner about the next deadline." },
  { q: "Will AgriPure apply for me?", a: "This is a self-serve guide — you apply directly with the agencies so the funds and contract are in your name. Bring this page and your product list to your planning meeting." },
  { q: "Are these programs guaranteed?", a: "No. Funding is limited and applications are ranked, so approval isn't guaranteed. But it costs nothing to apply and talk to your local office." },
];

const RESOURCES = [
  { label: "USDA Service Center locator (find your local NRCS/FSA office)", href: "https://www.farmers.gov/working-with-us/service-center-locator" },
  { label: "NRCS — Environmental Quality Incentives Program (EQIP)", href: "https://www.nrcs.usda.gov/programs-initiatives/environmental-quality-incentives-program" },
  { label: "NRCS — EQIP Organic Initiative", href: "https://www.nrcs.usda.gov/programs-initiatives/eqip-organic-initiative" },
  { label: "NRCS — Pest Management Conservation System (Code 595) practice standard", href: "https://www.nrcs.usda.gov/resources/guides-and-instructions/pest-management-conservation-system-ac-595-conservation-practice" },
  { label: "FSA — Organic Certification Cost Share Program (OCCSP)", href: "https://www.fsa.usda.gov/resources/programs/organic-certification-cost-share-program-occsp" },
  { label: "SARE — Grants", href: "https://www.sare.org/grants/" },
  { label: "Your state department of agriculture / local conservation district (NASDA)", href: "https://www.nasda.org/" },
];

const SUBNAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#programs", label: "Programs" },
  { href: "#apply", label: "Apply" },
  { href: "#faq", label: "FAQ" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" as const };

/* ─────────────────────────── page ─────────────────────────── */

export default function SubsidiesGuide() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggle = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_0%,#DCEFC8_0%,rgba(237,234,224,0)_62%)]" />
        <div className="relative mx-auto max-w-[820px] text-center">
          <Link href="/resources" className="ap-link inline-flex items-center gap-1.5 text-[13px] font-semibold text-leaf-700">
            <ArrowLeft size={15} strokeWidth={2.4} /> Back to Resources
          </Link>
          <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-leaf">Farm incentive guide</div>
          <h1 className="mt-3 font-display text-[clamp(34px,6vw,56px)] font-black leading-[1.02] tracking-[-0.02em] text-forest">
            Lower the Cost of Going Natural on Your Farm
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.65] text-fg2">
            Several state and federal conservation programs help farmers cover the cost of switching to biological pest
            control and natural nutrient inputs — including products like AgriPure&apos;s. This free guide shows you which
            programs you may qualify for and exactly how to apply.
          </p>
          <a href="#programs" className="btn-primary mt-8 px-8 py-4 text-[16px]">
            Find Your Program <ChevronDown size={18} strokeWidth={2.4} />
          </a>
          <p className="mx-auto mt-4 max-w-[520px] text-[13px] leading-[1.55] text-fg3">
            Independent guide to public programs. We don&apos;t run these programs — we help you find them and point you to
            the official application.
          </p>
        </div>
      </section>

      {/* STICKY SUB-NAV */}
      <nav className="sticky top-[72px] z-20 border-y border-hair bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container items-center gap-1 overflow-x-auto px-6 py-2.5 sm:px-8">
          {SUBNAV.map((s) => (
            <a key={s.href} href={s.href} className="whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-semibold text-fg2 transition-colors hover:bg-[#E9F0E0] hover:text-leaf-700">
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-container px-6 sm:px-8">
        {/* HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-32 py-16">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">
              First, How &ldquo;Subsidies&rdquo; Actually Work for Farm Inputs
            </h2>
            <p className="mx-auto mt-4 text-[16px] leading-[1.65] text-fg2">
              The government usually doesn&apos;t discount a specific product off the shelf. Instead, it pays you back for
              adopting better conservation <em>practices</em> — and natural inputs like AgriPure&apos;s can count toward
              those practices. Here&apos;s the simple version:
            </p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ Icon, title, body }, i) => (
              <li key={title} className="rounded-panel border border-hair bg-white p-7 shadow-g-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[#E9F0E0] text-leaf-700">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                  <span className="font-mono text-[13px] font-bold text-leaf-700">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-[19px] font-extrabold text-forest">{title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PROGRAMS */}
        <section id="programs" className="scroll-mt-32 py-8">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The core</div>
            <h2 className="mt-2 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">
              Programs that can help
            </h2>
            <p className="mx-auto mt-3 text-[15px] text-fg2">Tap &ldquo;Details&rdquo; on any program to see what it can offset, who&apos;s eligible, and how to apply.</p>
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {PROGRAMS.map((p) => {
              const isOpen = !!open[p.id];
              return (
                <div key={p.id} id={p.id} className="scroll-mt-32 overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                    <div className="min-w-0 flex-1">
                      <div className="inline-flex rounded-full bg-[#E9F0E0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-leaf-700">{p.tag}</div>
                      <h3 className="mt-3 font-display text-[22px] font-extrabold leading-tight tracking-[-0.01em] text-forest">{p.name}</h3>
                      <p className="mt-2 text-[15.5px] leading-[1.6] text-fg2">{p.oneLiner}</p>
                    </div>
                    <button
                      onClick={() => toggle(p.id)}
                      aria-expanded={isOpen}
                      aria-controls={`${p.id}-details`}
                      className="inline-flex flex-none items-center gap-1.5 self-start rounded-full border border-hair-strong px-4 py-2 text-[14px] font-bold text-forest transition-colors hover:border-leaf hover:text-leaf-700"
                    >
                      {isOpen ? "Hide" : "Details"}
                      <ChevronDown size={16} strokeWidth={2.4} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {isOpen && (
                    <div id={`${p.id}-details`} className="border-t border-hair bg-[#FCFBF7] px-6 py-6 sm:px-7">
                      <dl className="grid gap-5 sm:grid-cols-2">
                        <Field label="What it can offset" value={p.offset} />
                        <Field label="Who's eligible" value={p.eligible} />
                        <Field label="Good to know" value={p.goodToKnow} />
                        {p.apply && <Field label="How to apply" value={p.apply} />}
                      </dl>
                    </div>
                  )}

                  <div className="border-t border-hair px-6 py-4 sm:px-7">
                    <a href={p.button.href} {...ext} className="inline-flex items-center gap-2 text-[15px] font-bold text-leaf-700 hover:text-forest">
                      {p.button.label} <ExternalLink size={15} strokeWidth={2.2} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DECISION HELPER */}
        <section className="py-16">
          <div className="rounded-panel border border-hair bg-white p-7 shadow-g-sm sm:p-9">
            <h2 className="font-display text-[clamp(24px,3.5vw,34px)] font-black tracking-[-0.02em] text-forest">
              Not Sure Where to Start? Pick What Describes You.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PROFILES.map((pr, i) => {
                const on = profile === i;
                return (
                  <button
                    key={i}
                    onClick={() => setProfile(on ? null : i)}
                    aria-pressed={on}
                    className={`rounded-full px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${on ? "bg-forest text-white" : "border border-hair-strong bg-white text-fg2 hover:border-forest"}`}
                  >
                    {pr.label}
                  </button>
                );
              })}
            </div>
            {profile !== null && (
              <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-leaf bg-[#F2F7EC] p-5">
                <ArrowRight size={18} strokeWidth={2.6} className="mt-0.5 flex-none text-leaf-700" />
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-leaf-700">Recommended</div>
                  <p className="mt-1 text-[15.5px] leading-[1.6] text-forest">{PROFILES[profile].rec}</p>
                  <a href={`#${PROFILES[profile].target}`} onClick={() => setOpen((p) => ({ ...p, [PROFILES[profile].target]: true }))} className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-leaf-700 hover:text-forest">
                    Jump to that program <ArrowRight size={14} strokeWidth={2.4} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* APPLY */}
        <section id="apply" className="scroll-mt-32 py-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">How to Apply (the Common Path)</h2>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {APPLY_STEPS.map(({ Icon, title, body }, i) => (
              <li key={title} className="flex gap-4 rounded-panel border border-hair bg-white p-6 shadow-g-sm">
                <div className="flex flex-none flex-col items-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-white">
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <span className="mt-1.5 font-mono text-[12px] font-bold text-fg3">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-display text-[17px] font-extrabold text-forest">{title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-fg2">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-leaf bg-[#F2F7EC] p-5">
            <BadgeDollarSign size={20} strokeWidth={2} className="mt-0.5 flex-none text-leaf-700" />
            <p className="text-[15px] leading-[1.6] text-forest">
              <strong>Tip —</strong> ask specifically whether you qualify for <strong>higher payment rates</strong> as a
              beginning, veteran, limited-resource, or socially disadvantaged farmer. Advance payments may also be available.
            </p>
          </div>
        </section>

        {/* HOW AGRIPURE FITS */}
        <section className="py-16">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Where AgriPure Products Fit In</h2>
            <p className="mx-auto mt-4 text-[16px] leading-[1.65] text-fg2">
              AgriPure makes natural pesticides (insecticides, fungicides, herbicides) and biological nutrient products.
              These fall into the <em>biological / lower-risk input</em> categories that conservation pest- and
              nutrient-management practices are designed to encourage. That means when your approved plan calls for
              reduced-risk pest control or improved nutrient management, AgriPure products can be part of how you meet it.
            </p>
          </div>
          <div className="mx-auto mt-9 max-w-[860px] overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[15px]">
                <thead className="border-b border-hair bg-[#FAF8F2] text-[11.5px] uppercase tracking-[0.05em] text-fg3">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">If your conservation plan involves…</th>
                    <th className="px-6 py-3.5 font-bold">AgriPure products that may fit</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_FIT.map((r) => (
                    <tr key={r.plan} className="border-b border-[#F2EFE6] last:border-0">
                      <td className="px-6 py-4 text-fg2">{r.plan}</td>
                      <td className="px-6 py-4 font-semibold text-forest">{r.products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-[760px] text-center text-[14px] leading-[1.6] text-fg3">
            Eligibility is determined by your conservation planner and program rules — not by the product brand. Always
            confirm which specific inputs your plan allows before purchasing.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-32 py-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Frequently asked questions</h2>
          </div>
          <div className="mx-auto mt-9 max-w-[820px] overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
            {FAQS.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <div key={i} className="border-b border-hair last:border-0">
                  <h3>
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-display text-[17px] font-extrabold text-forest">{f.q}</span>
                      <ChevronDown size={18} strokeWidth={2.4} className={`flex-none text-leaf-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={`faq-${i}`} className="px-6 pb-5 text-[15px] leading-[1.65] text-fg2">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* RESOURCES */}
        <section className="py-16">
          <div className="rounded-panel border border-hair bg-white p-7 shadow-g-sm sm:p-9">
            <h2 className="font-display text-[clamp(22px,3vw,30px)] font-black tracking-[-0.02em] text-forest">Official links &amp; resources</h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {RESOURCES.map((r) => (
                <li key={r.href}>
                  <a href={r.href} {...ext} className="group flex items-start gap-2.5 rounded-[12px] border border-hair px-4 py-3 transition-colors hover:border-leaf hover:bg-[#FCFBF7]">
                    <ExternalLink size={16} strokeWidth={2.2} className="mt-0.5 flex-none text-leaf-700" />
                    <span className="text-[14.5px] font-medium leading-[1.5] text-fg2 group-hover:text-forest">{r.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* DISCLAIMER */}
      <section className="border-t border-hair bg-[#F4F1E8] px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-[860px]">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-fg3">Important disclaimer</div>
          <p className="mt-2.5 text-[13px] leading-[1.7] text-fg3">
            This page is an educational guide to publicly available government conservation and cost-share programs.
            AgriPure is a private company and is not affiliated with, sponsored by, or endorsed by USDA or any government
            agency. These programs fund conservation practices and eligible input categories — not specific brands — and do
            not guarantee that any particular product purchase will be reimbursed. Program availability, eligibility,
            payment rates, and funding change by state, county, and year. Dollar figures are shown as of 2025–2026 and are
            subject to change. Always confirm current details and your eligibility with your local NRCS office, FSA office,
            or state department of agriculture before making purchasing decisions.
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] font-bold uppercase tracking-[0.06em] text-leaf-700">{label}</dt>
      <dd className="mt-1.5 text-[15px] leading-[1.6] text-fg2">{value}</dd>
    </div>
  );
}
