// The 6 steps of the scroll-driven hero experience (verbatim copy from the
// approved prototype / live AgriPure site). See design-handoff/EXPERIENCE_3D.md.

export interface ExperienceStep {
  id: string;
  step: string;
  name: string;
  title: string;
  accent: string;
  action: string;
  threat: "soil" | "residue" | "root" | "pest" | "virus" | "slow" | "none";
  tcolor: string;
  desc: string;
}

export const EXPERIENCE_STEPS: ExperienceStep[] = [
  {
    id: "restore", step: "01", name: "Restore", title: "Soil Restoration & Health",
    accent: "#86CC63", action: "Revitalizing depleted soil", threat: "soil", tcolor: "#C08A3A",
    desc: "We begin by revitalizing your soil with potent nano particles of nutrients and micro-organisms, tailored to your soil sample report. This essential step lays a healthy foundation for your crops.",
  },
  {
    id: "cleanse", step: "02", name: "Cleanse", title: "Cleanse & Detox",
    accent: "#E2B43E", action: "Clearing chemical residue", threat: "residue", tcolor: "#B8A24E",
    desc: "We cleanse your soil and crops from harmful residues left by previous chemical treatments, creating a clean environment for natural growth and protection.",
  },
  {
    id: "strength", step: "03", name: "Strength", title: "Root Strengthening",
    accent: "#5AA0E0", action: "Driving deeper roots", threat: "root", tcolor: "#B58A4A",
    desc: "Our specialized root-boosting formula promotes deeper, stronger root systems that improve water and nutrient absorption across all crop types.",
  },
  {
    id: "protect", step: "04", name: "Protect", title: "Pest & Disease Defense",
    accent: "#E88A4C", action: "Repelling pests & disease", threat: "pest", tcolor: "#C0531C",
    desc: "A natural pesticide barrier — insecticide and fungicide in one — protects your crops from common pests and from fungal, bacterial, and viral disease before they can cause damage, reducing crop loss significantly.",
  },
  {
    id: "grow", step: "05", name: "Grow", title: "Growth & Plant Health",
    accent: "#86CC63", action: "Driving healthy, resilient growth", threat: "slow", tcolor: "#5B8A3C",
    desc: "Custom nutrient-and-biostimulant blends drive healthy growth while targeting the plant-health problems your specific crop faces — correcting deficiencies, stresses, and disorders so growth is strong where your crop is usually weakest.",
  },
  {
    id: "boost", step: "06", name: "Boost", title: "Harvest Optimization",
    accent: "#E2B43E", action: "Optimizing yield & quality", threat: "none", tcolor: "#C89A2E",
    desc: "The final step ensures your crops reach peak quality at harvest time with a finishing treatment that enhances yield, color, and shelf life.",
  },
];
