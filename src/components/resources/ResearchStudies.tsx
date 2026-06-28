"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronDown, ExternalLink, Leaf, ShieldCheck, BadgeCheck, Sprout,
  FlaskConical, Sun, Bug, Droplets, CloudRain, Beef, ClipboardList, ScrollText,
} from "lucide-react";

/* ───────────────────────── evidence tiers ───────────────────────── */
type Tier = "Established" | "Promising" | "Mixed" | "Theory";
const TIER_STYLE: Record<Tier, string> = {
  Established: "bg-[#E9F0E0] text-leaf-700",
  Promising: "bg-[#FBEFD9] text-[#B07A1E]",
  Mixed: "bg-[#FBE7D6] text-[#B2702A]",
  Theory: "bg-[#E7ECEF] text-[#5A6670]",
};
function TierBadge({ tier }: { tier: Tier }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] ${TIER_STYLE[tier]}`}>{tier}</span>;
}

const ext = { target: "_blank", rel: "noopener noreferrer" as const };

/* ───────────────────────── data ───────────────────────── */

const PILLARS = [
  { Icon: ShieldCheck, title: "Residue-free & non-toxic", lead: true, body: "No chemical residue on produce, no re-entry or pre-harvest interval, no operator exposure, no run-off toxicity — clean for your crew, your soil, and your buyers." },
  { Icon: BadgeCheck, title: "Market access & clean-label value", body: "Residue-free produce opens premium and export markets with strict maximum-residue-limit (MRL) rules, and meets buyer and consumer demand for clean, traceable food." },
  { Icon: Leaf, title: "Organic-certification fit", body: "Designed to fit organic and agroecological systems — including as a proposed alternative to copper-based inputs like Bordeaux mixture that organic growers want to reduce." },
  { Icon: Sprout, title: "Soil & plant vitality", body: "Reported improvements in germination, seedling vigor, chlorophyll, protein and sugar content, and stress tolerance — healthier, more resilient crops." },
  { Icon: FlaskConical, title: "A real, growing science base", body: "Not folklore: a body of peer-reviewed plant-model and field research, with reviews cataloguing dozens of positive studies. That evidence base is what separates this from snake oil." },
];

const STATS = [
  { value: "29 of 48", tier: "Established" as Tier, body: "Of 167 plant studies analyzed across major reviews, 48 met minimum methodological-quality criteria — and 29 of those detected specific effects of homeopathic high dilutions on plants.", href: "https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-0038-1639580" },
  { value: "45x", tier: "Established" as Tier, body: "An ultra-molecular 45x dilution of Arsenicum album (beyond Avogadro's limit) produced a significant, reproducible stimulating effect on wheat seedling growth.", href: "https://www.researchgate.net/publication/7535297" },
  { value: "Sulphur 12CH", tier: "Established" as Tier, body: "Under organic production, high-dilution Sulphur 12CH protected tomato against the small borer and showed potential to replace Bordeaux mixture and other pesticides.", href: "http://www.scielo.br/j/hb/a/q4VgWQBqhnDfQC6NgLvycww/?lang=en" },
];

const EVIDENCE = [
  { tier: "Established" as Tier, title: "Systematic review of plant-based homeopathic basic research (update)", takeaway: "The strongest single talking point: across 167 studies, the higher-quality work — using systematic negative controls and reproducibility — reported significant effects on plants.", journal: "Homeopathy (Thieme, 2018)", href: "https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-0038-1639580" },
  { tier: "Established" as Tier, title: "Use of homeopathic preparations in phytopathological models & field trials: a critical review", takeaway: "Betti et al. (2009) — the first comprehensive review since 1984. Catalogues positive results in disease models and field trials and concludes plant–pathogen systems are promising.", journal: "Homeopathy 98:244–266", href: "https://pubmed.ncbi.nlm.nih.gov/19945678/" },
  { tier: "Established" as Tier, title: "45x Arsenicum album on wheat seedling growth — reproduction trial", takeaway: "An ultra-molecular dilution produced a significant stimulating effect and reduced variability — confirmed as a reliable basic-research model.", journal: "Wheat germination model", href: "https://www.researchgate.net/publication/7535297" },
  { tier: "Established" as Tier, title: "Homeopathic preparations to control the rosy apple aphid (Dysaphis plantaginea)", takeaway: "Peer-reviewed pest-control evidence on apple — directly relevant to the residue-free crop-protection case.", journal: "Homeopathy / PMC", href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5763761/" },
  { tier: "Established" as Tier, title: "High-dilution pest management for tomato under organic production", takeaway: "Sulphur 12CH protected fruit against the small borer; preparations showed potential to replace Bordeaux mixture (copper) under organic certification — the best 'organic replacement' data point.", journal: "Horticultura Brasileira (SciELO)", href: "http://www.scielo.br/j/hb/a/q4VgWQBqhnDfQC6NgLvycww/?lang=en" },
  { tier: "Established" as Tier, title: "Mineral dynamised high dilutions as biostimulants in agroecological strawberry", takeaway: "Recent (2024) work on a high-value crop: effects on growth, yield, fruit quality, and pest/disease incidence.", journal: "Biological Agriculture & Horticulture (2024)", href: "https://www.tandfonline.com/doi/full/10.1080/01448765.2024.2396894" },
  { tier: "Promising" as Tier, title: "Potentized preparations alter plant physiology", takeaway: "Reported changes in enzymatic activity, total sugar, protein and chlorophyll content — the mechanism story behind 'healthier plants.' Promising, still being characterized.", journal: "Plant physiology literature", href: "https://www.researchgate.net/publication/328554172" },
  { tier: "Mixed" as Tier, title: "Homeopathy in livestock, 1981–2014 — peer-reviewed review", takeaway: "Of 52 trials, 28 favored homeopathy (26 significant) vs 22 showing no effect. Present honestly as a mixed but substantial positive signal — useful for mixed crop-livestock farms.", journal: "Veterinary Record / PMC", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5256414/" },
];

const PRACTICE = [
  { Icon: Sprout, title: "Seed treatment", body: "Seed soaks with potentized preparations are the most-studied entry point — wheat and okra models report improved germination and seedling vigor.", tier: "Established" as Tier },
  { Icon: Sun, title: "Growth & vigor", body: "Foliar and soil applications associated with gains in chlorophyll, protein and sugar content and overall plant vitality.", tier: "Promising" as Tier },
  { Icon: Bug, title: "Pest control", body: "Field and greenhouse evidence against pests such as the rosy apple aphid and tomato borer.", tier: "Established" as Tier },
  { Icon: Droplets, title: "Disease control", body: "Phytopathology reviews and an Arabidopsis–Pseudomonas model report measurable effects in plant–pathogen systems.", tier: "Established" as Tier },
  { Icon: CloudRain, title: "Abiotic stress", body: "A dedicated review finds the clearest effects appear in stressed plants (heat, salinity, toxicity) — where the upside is largest.", tier: "Established" as Tier },
  { Icon: Beef, title: "Livestock (mixed farms)", body: "A substantial-but-mixed body of veterinary trials; relevant if you run animals alongside crops. Trial and verify.", tier: "Mixed" as Tier },
];

const COMPARE = [
  { factor: "Chemical residue on produce", conv: "Common — subject to MRLs & withdrawal periods", ah: "None — residue-free", ahGood: true },
  { factor: "Operator safety & re-entry", conv: "PPE, re-entry intervals, exposure risk", ah: "Non-toxic — no re-entry or PHI issues", ahGood: true },
  { factor: "Soil & run-off impact", conv: "Run-off toxicity; soil-life pressure", ah: "Soil-friendly — no toxic run-off", ahGood: true },
  { factor: "Organic-certification fit", conv: "Restricted; copper inputs under pressure", ah: "Proposed fit; copper-replacement evidence*", ahGood: true },
  { factor: "Premium / export market access", conv: "Can be limited by residue limits", ah: "Supports clean-label & strict-MRL markets", ahGood: true },
  { factor: "Evidence maturity", conv: "Extensive, well-established", ah: "Growing — strongest in stressed-plant & pest systems", ahGood: false },
];

const OBJECTIONS = [
  { q: "“It's just water — there's no molecule left.”", a: "True that many preparations are diluted beyond Avogadro's limit, so little or no original substance remains. The honest counter is empirical, not theoretical: reproducible plant-model effects — the 45x wheat trial and impaired-duckweed test systems — are measured even where the mechanism is still debated. We keep the claim modest and anchored to that evidence." },
  { q: "“Many trials show nothing.”", a: "Concede it — they do. Results vary by remedy, potency and dose, and the mainstream position is skeptical. The signal is clearest in stressed plants and pest/disease systems. That variability is exactly why the smart move is a farmer-run split-field trial on your own ground before you scale." },
  { q: "“Is it allowed in organic / regulated production?”", a: "There is a proposed fit with organic systems and real data on replacing copper (Bordeaux mixture) in tomato — but rules differ by region and certifier. Confirm with your certifier and local regulations before relying on it for compliance." },
];

const TRIAL = [
  { n: "1", title: "Split a field", body: "Pick one crop and split it into matched plots — treated vs. untreated control — ideally replicated 3–4 times." },
  { n: "2", title: "Apply on a schedule", body: "Apply the selected preparation per protocol (seed soak / foliar / soil) on a defined, consistent schedule." },
  { n: "3", title: "Measure what matters", body: "Track germination %, vigor, pest/disease incidence, yield, fruit quality/grade, and residue levels." },
  { n: "4", title: "Scale only what wins", body: "Compare plots and scale only what beats the control on your own soil and climate." },
];

const SOURCES: { group: string; tier: Tier; items: { label: string; href: string }[] }[] = [
  {
    group: "Peer-reviewed reviews & meta-analyses", tier: "Established",
    items: [
      { label: "Betti L. et al. (2009). Homeopathic preparations in phytopathological models & field trials: a critical review. Homeopathy 98:244–266", href: "https://pubmed.ncbi.nlm.nih.gov/19945678/" },
      { label: "Majewsky V. et al. (2009). Homeopathic preparations in experimental studies with healthy plants. Homeopathy", href: "https://www.researchgate.net/publication/347524238_Research_on_homeopathy_and_plants" },
      { label: "Jäger T. et al. (2011). Homeopathic preparations in studies with abiotically stressed plants. Homeopathy", href: "https://www.sciencedirect.com/science/article/abs/pii/S1475491611000889" },
      { label: "Systematic Review of Plant-Based Homeopathic Basic Research: An Update. Homeopathy (Thieme, 2018)", href: "https://www.thieme-connect.com/products/ejournals/abstract/10.1055/s-0038-1639580" },
      { label: "Meta-analysis of homoeopathic ultra-high dilutions on wheat growth & disease management", href: "https://www.researchgate.net/publication/371256591" },
      { label: "From Kolisko to nowadays: progresses and discoveries in agro-homeopathy. Int. J. High Dilution Research", href: "https://www.highdilution.org/index.php/ijhdr/article/view/585" },
    ],
  },
  {
    group: "Primary studies — crops, pests, disease", tier: "Established",
    items: [
      { label: "Homeopathic preparations to control the rosy apple aphid (Dysaphis plantaginea). Homeopathy / PMC", href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5763761/" },
      { label: "Homeopathic treatment of Arabidopsis thaliana infected with Pseudomonas syringae. PMC", href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5823120/" },
      { label: "High-dilution pest management for tomato under organic production. Horticultura Brasileira (SciELO)", href: "http://www.scielo.br/j/hb/a/q4VgWQBqhnDfQC6NgLvycww/?lang=en" },
      { label: "Mineral dynamised high dilutions for natural plant biostimulation — agroecological strawberry. Biological Agriculture & Horticulture (2024)", href: "https://www.tandfonline.com/doi/full/10.1080/01448765.2024.2396894" },
      { label: "Ecological strawberry production: promoting crop vitality with high-dynamized dilutions. Int. J. High Dilution Research", href: "https://highdilution.org/index.php/ijhdr/article/view/1207" },
    ],
  },
  {
    group: "Wheat & plant-model basic research (mechanism & reproducibility)", tier: "Established",
    items: [
      { label: "Biostatistical insight into As₂O₃ high-dilution effects on wheat seedling growth. PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/16230857/" },
      { label: "Efficacy of ultramolecular aqueous dilutions on a wheat germination model. PMC", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3137211/" },
      { label: "Effects of a 45x potency of Arsenicum album on wheat seedling growth — a reproduction trial", href: "https://www.researchgate.net/publication/7535297" },
      { label: "Test system for homeopathic preparations using impaired duckweed (Lemna gibba L.). J. Altern. Complement. Med.", href: "https://journals.sagepub.com/doi/abs/10.1089/acm.2010.0246" },
      { label: "Potentised drugs promote growth of lady's finger (okra)", href: "https://www.researchgate.net/publication/287912558" },
    ],
  },
  {
    group: "Systemic framework", tier: "Theory",
    items: [
      { label: "Di Lorenzo F. & Dinelli G. Systemic Agro-Homeopathy: A New Approach to Agriculture. OBM Integrative & Complementary Medicine", href: "https://www.lidsen.com/journals/icm/icm-06-03-020" },
    ],
  },
  {
    group: "Livestock (for mixed farms — mixed but positive signal)", tier: "Mixed",
    items: [
      { label: "Doehring C. & Sundrum A. (2016). Efficacy of homeopathy in livestock, 1981–2014. Veterinary Record / PMC", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5256414/" },
      { label: "Individualised homeopathy vs antibiotics in bovine clinical mastitis: RCT. PMC", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5890642/" },
    ],
  },
  {
    group: "Overviews, programs & practitioner literature", tier: "Promising",
    items: [
      { label: "Usage of homeopathic treatments for plant-pathogen control — a comprehensive review", href: "https://www.researchgate.net/publication/378591263" },
      { label: "Agrohomeopathy: an emerging field for higher crop productivity & plant protection under stress", href: "https://www.researchgate.net/publication/328554172" },
      { label: "The homeopathic products used in plant protection: an alternative choice", href: "https://www.researchgate.net/publication/322505690" },
      { label: "Agrohomeopathy (IJRAR)", href: "https://www.ijrar.org/papers/IJRAR1904125.pdf" },
      { label: "Agrohomeopathy: Stronger Plants, Cleaner Food — National Center for Homeopathy", href: "https://homeopathycenter.org/agrohomeopathy-stronger-plants-cleaner-food/" },
      { label: "Agro-Homoeopathy as an eco-friendly alternative to chemical agriculture — homeopathy360", href: "https://www.homeopathy360.com/agro-homoeopathy-as-an-eco-friendly-alternative-to-chemical-agriculture" },
      { label: "AHAR — Agro-Homeopathy for Sustainable Agriculture (Auroville / Svarnim, India)", href: "https://svarnim.aurosociety.org/projects/agro-homeopathy-for-sustainable-agriculture/" },
      { label: "V.D. Kaviraj — Homeopathy for Farm and Garden (foundational practitioner reference)", href: "https://www.homeopathicbooks.com/product/homeopathy-for-farm-and-garden-the-homeopathic-treatment-of-plants-vaikunthanath-das-kaviraj/" },
    ],
  },
];

const SUBNAV = [
  { href: "#what", label: "What it is" },
  { href: "#benefits", label: "Benefits" },
  { href: "#evidence", label: "Evidence" },
  { href: "#practice", label: "In practice" },
  { href: "#trial", label: "Trial it" },
  { href: "#sources", label: "Sources" },
];

/* ───────────────────────── page ───────────────────────── */

export default function ResearchStudies() {
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <div className="bg-paper">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(110%_85%_at_50%_0%,#DCEFC8_0%,rgba(237,234,224,0)_62%)]" />
        <div className="relative mx-auto max-w-[860px] text-center">
          <Link href="/resources" className="ap-link inline-flex items-center gap-1.5 text-[13px] font-semibold text-leaf-700">
            <ArrowLeft size={15} strokeWidth={2.4} /> Back to Resources
          </Link>
          <div className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-leaf">Research &amp; evidence</div>
          <h1 className="mt-3 font-display text-[clamp(32px,5.5vw,54px)] font-black leading-[1.03] tracking-[-0.02em] text-forest">
            Stronger plants, cleaner food — backed by a growing science base
          </h1>
          <p className="mx-auto mt-5 max-w-[680px] text-[17px] leading-[1.65] text-fg2">
            Chemical residues, tightening residue limits, soil burnout, and pressure to reach organic and premium markets
            are real costs. AgriPure&apos;s ultra-high-dilution (agrohomeopathy) approach is a non-toxic, residue-free,
            soil-friendly tool with a real and growing peer-reviewed evidence base. Here&apos;s the honest case — sources
            and all.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#evidence" className="btn-primary px-7 py-3.5 text-[15px]">See the evidence <ChevronDown size={17} strokeWidth={2.4} /></a>
            <a href="#trial" className="btn-ghost px-7 py-3.5 text-[15px]">Trial it on your farm</a>
          </div>
        </div>
      </section>

      {/* STICKY SUB-NAV */}
      <nav className="sticky top-[72px] z-20 border-y border-hair bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container items-center gap-1 overflow-x-auto px-6 py-2.5 sm:px-8">
          {SUBNAV.map((s) => (
            <a key={s.href} href={s.href} className="whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-semibold text-fg2 transition-colors hover:bg-[#E9F0E0] hover:text-leaf-700">{s.label}</a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-container px-6 sm:px-8">
        {/* HOW TO READ THIS */}
        <section className="py-12">
          <div className="rounded-panel border border-leaf bg-[#F2F7EC] p-6 sm:p-7">
            <div className="flex items-center gap-2 font-display text-[17px] font-extrabold text-forest"><ScrollText size={18} /> How to read this evidence</div>
            <p className="mt-2.5 text-[15px] leading-[1.65] text-fg2">
              We don&apos;t claim scientific consensus — the mainstream position is skeptical and many trials show no effect
              or aren&apos;t reproducible. What is true: a growing peer-reviewed literature reports measurable effects, the
              best results appear in stressed-plant and pest/disease systems, and the non-toxic, residue-free profile makes
              it worth trialing on your own farm. Every claim below is tagged by evidence strength:
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="flex items-center gap-2 text-[13px] text-fg2"><TierBadge tier="Established" /> peer-reviewed, positive effects</span>
              <span className="flex items-center gap-2 text-[13px] text-fg2"><TierBadge tier="Promising" /> single trials / field reports</span>
              <span className="flex items-center gap-2 text-[13px] text-fg2"><TierBadge tier="Mixed" /> substantial but mixed results</span>
              <span className="flex items-center gap-2 text-[13px] text-fg2"><TierBadge tier="Theory" /> mechanism still debated</span>
            </div>
          </div>
        </section>

        {/* WHAT IT IS */}
        <section id="what" className="scroll-mt-32 pb-12">
          <div className="mx-auto max-w-[820px]">
            <h2 className="font-display text-[clamp(24px,4vw,36px)] font-black tracking-[-0.02em] text-forest">What agrohomeopathy is</h2>
            <p className="mt-4 text-[16.5px] leading-[1.7] text-fg2">
              Agrohomeopathy uses <strong className="text-forest">ultra-high-dilution (UHD) preparations</strong> — applied
              to seeds, plants, soil, and livestock — to support crop nutrition and crop protection. The preparations are
              non-toxic and leave no chemical residue. It isn&apos;t new: the approach traces back to Lili Kolisko&apos;s
              plant experiments in the <strong className="text-forest">1920s</strong>, and has since grown into a body of
              plant-model and field research.
            </p>
          </div>
        </section>

        {/* STAT CALLOUTS */}
        <section className="grid gap-5 pb-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <a key={s.value} href={s.href} {...ext} className="group rounded-panel border border-hair bg-white p-6 shadow-g-sm transition-colors hover:border-leaf">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[26px] font-bold text-forest">{s.value}</div>
                <TierBadge tier={s.tier} />
              </div>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg2">{s.body}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-leaf-700">Source <ExternalLink size={13} strokeWidth={2.2} /></span>
            </a>
          ))}
        </section>

        {/* BENEFITS / PILLARS */}
        <section id="benefits" className="scroll-mt-32 py-16">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-leaf">The grower&apos;s case</div>
            <h2 className="mt-2 font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">Five reasons growers trial it</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ Icon, title, body, lead }) => (
              <div key={title} className={`rounded-panel border bg-white p-7 shadow-g-sm ${lead ? "border-leaf ring-1 ring-leaf/30" : "border-hair"}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0E0] text-leaf-700"><Icon size={23} strokeWidth={1.9} /></span>
                <h3 className="mt-5 font-display text-[19px] font-extrabold text-forest">{title}{lead && <span className="ml-2 rounded-full bg-leaf px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-[0.05em] text-white">Lead</span>}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-fg2">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EVIDENCE */}
        <section id="evidence" className="scroll-mt-32 py-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">The evidence, strongest first</h2>
            <p className="mx-auto mt-3 text-[15.5px] leading-[1.6] text-fg2">Peer-reviewed reviews and crop studies lead; field reports and mechanism work support. Tap any card for the source.</p>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            {EVIDENCE.map((e) => (
              <a key={e.title} href={e.href} {...ext} className="group flex flex-col gap-2 rounded-panel border border-hair bg-white p-6 shadow-g-sm transition-colors hover:border-leaf sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <TierBadge tier={e.tier} />
                    <span className="text-[12px] font-semibold text-fg3">{e.journal}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[18px] font-extrabold leading-snug text-forest">{e.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-fg2">{e.takeaway}</p>
                </div>
                <span className="inline-flex flex-none items-center gap-1.5 self-start whitespace-nowrap text-[13px] font-bold text-leaf-700">Read <ExternalLink size={14} strokeWidth={2.2} /></span>
              </a>
            ))}
          </div>
        </section>

        {/* OBJECTIONS */}
        <section className="py-16">
          <div className="mx-auto max-w-[820px]">
            <h2 className="font-display text-[clamp(24px,4vw,36px)] font-black tracking-[-0.02em] text-forest">&ldquo;But does it really work?&rdquo;</h2>
            <p className="mt-3 text-[15.5px] leading-[1.65] text-fg2">The fair questions, answered straight — addressing the skeptic is how this earns trust.</p>
            <div className="mt-6 overflow-hidden rounded-panel border border-hair bg-white shadow-g-sm">
              {OBJECTIONS.map((o, i) => {
                const open = faq === i;
                return (
                  <div key={i} className="border-b border-hair last:border-0">
                    <h3>
                      <button onClick={() => setFaq(open ? null : i)} aria-expanded={open} aria-controls={`obj-${i}`} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                        <span className="font-display text-[16.5px] font-extrabold text-forest">{o.q}</span>
                        <ChevronDown size={18} strokeWidth={2.4} className={`flex-none text-leaf-700 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                    </h3>
                    {open && <div id={`obj-${i}`} className="px-6 pb-5 text-[15px] leading-[1.7] text-fg2">{o.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IN PRACTICE */}
        <section id="practice" className="scroll-mt-32 py-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="font-display text-[clamp(26px,4vw,40px)] font-black tracking-[-0.02em] text-forest">How it works in practice</h2>
            <p className="mx-auto mt-3 text-[15.5px] text-fg2">Where growers apply it — and how strong the evidence is for each use.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE.map(({ Icon, title, body, tier }) => (
              <div key={title} className="rounded-panel border border-hair bg-white p-6 shadow-g-sm">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9F0E0] text-leaf-700"><Icon size={21} strokeWidth={1.9} /></span>
                  <TierBadge tier={tier} />
                </div>
                <h3 className="mt-4 font-display text-[17px] font-extrabold text-forest">{title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-fg2">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VALUE / COMPARISON */}
        <section className="py-16">
          <div className="mx-auto max-w-[820px] text-center">
            <h2 className="font-display text-[clamp(24px,4vw,36px)] font-black tracking-[-0.02em] text-forest">The value story</h2>
            <p className="mx-auto mt-3 text-[15.5px] leading-[1.65] text-fg2">
              Residue-free produce opens premium and export markets with strict residue limits, supports organic
              certification, and delivers cleaner, more resilient crops. The case is about <strong className="text-forest">value</strong> — crop
              quality, market access, and a real evidence base — not a cost claim.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-[900px] overflow-hidden rounded-panel border border-hair bg-white shadow-g-md">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[14.5px]">
                <thead className="border-b border-hair bg-[#FAF8F2] text-[11.5px] uppercase tracking-[0.05em] text-fg3">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Factor</th>
                    <th className="px-5 py-3.5 font-bold">Conventional inputs</th>
                    <th className="px-6 py-3.5 font-bold text-leaf-700">Agrohomeopathy</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r) => (
                    <tr key={r.factor} className="border-b border-[#F2EFE6] last:border-0">
                      <td className="px-6 py-3.5 font-semibold text-forest">{r.factor}</td>
                      <td className="px-5 py-3.5 text-fg2">{r.conv}</td>
                      <td className={`px-6 py-3.5 ${r.ahGood ? "font-semibold text-leaf-700" : "text-fg2"}`}>{r.ah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mx-auto mt-3 max-w-[900px] text-[12.5px] text-fg3">*Copper (Bordeaux mixture) replacement evidence comes from organic tomato research; confirm organic compliance with your certifier. We intentionally omit a price column — AgriPure&apos;s pricing is comparable to conventional inputs and is not the selling point.</p>
        </section>

        {/* TRIAL */}
        <section id="trial" className="scroll-mt-32 py-8">
          <div className="rounded-panel border border-leaf bg-[#F2F7EC] p-7 sm:p-9">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-leaf"><ClipboardList size={16} /> Prove it on your own ground</div>
            <h2 className="mt-2 font-display text-[clamp(24px,4vw,36px)] font-black tracking-[-0.02em] text-forest">Run a split-field trial</h2>
            <p className="mt-3 max-w-[680px] text-[15.5px] leading-[1.65] text-fg2">
              The honest way to decide is to test it yourself — simple enough to run, measurable enough to trust. Treat it
              as a complement to your working program, not a guaranteed replacement.
            </p>
            <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TRIAL.map((t) => (
                <li key={t.n} className="rounded-[16px] border border-hair bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-[15px] font-black text-white">{t.n}</span>
                  <h3 className="mt-3 font-display text-[16px] font-extrabold text-forest">{t.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.55] text-fg2">{t.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/order-now" className="btn-primary px-7 py-3.5 text-[15px]">Build my program</Link>
              <Link href="/how-it-works" className="btn-ghost px-7 py-3.5 text-[15px]">How it works</Link>
            </div>
          </div>
        </section>

        {/* SOURCES */}
        <section id="sources" className="scroll-mt-32 py-16">
          <div className="mx-auto max-w-[860px]">
            <h2 className="font-display text-[clamp(24px,4vw,36px)] font-black tracking-[-0.02em] text-forest">Sources</h2>
            <p className="mt-3 text-[15px] text-fg2">Every claim on this page traces to one of these published sources. Links open in a new tab.</p>
            <div className="mt-7 flex flex-col gap-7">
              {SOURCES.map((grp) => (
                <div key={grp.group}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-[17px] font-extrabold text-forest">{grp.group}</h3>
                    <TierBadge tier={grp.tier} />
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {grp.items.map((it) => (
                      <li key={it.href}>
                        <a href={it.href} {...ext} className="group flex items-start gap-2.5 rounded-[10px] border border-hair bg-white px-4 py-3 transition-colors hover:border-leaf hover:bg-[#FCFBF7]">
                          <ExternalLink size={15} strokeWidth={2.2} className="mt-0.5 flex-none text-leaf-700" />
                          <span className="text-[14px] leading-[1.5] text-fg2 group-hover:text-forest">{it.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* HONESTY DISCLAIMER */}
      <section className="border-t border-hair bg-[#F4F1E8] px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-[860px]">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-fg3">A note on the evidence</div>
          <p className="mt-2.5 text-[13px] leading-[1.7] text-fg3">
            This page summarizes published research on agrohomeopathy / ultra-high-dilution preparations. The mainstream
            scientific position remains skeptical, and results vary by remedy, potency, dose, crop, and conditions —
            effects are clearest in stressed-plant and pest/disease systems. Nothing here is a guarantee of results, and
            agrohomeopathy should be treated as a complement to — not a guaranteed replacement for — working crop
            protection. Confirm organic-certification and regulatory compliance with your certifier and local authority
            before relying on it. The best test is a controlled split-field trial on your own farm.
          </p>
        </div>
      </section>
    </div>
  );
}
