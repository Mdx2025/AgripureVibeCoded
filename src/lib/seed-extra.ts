// Seed data for the dashboard modules added to match the reference backend
// (clients, formulas, remedies, admins, team, proven-in-field, faqs).

export const SEED_CLIENTS = [
  { company: "Mdx", clientName: "Gianny Macri", email: "gianny@mdx.so", address: "VE, Porlamar, La asuncion c12, 6311", dateCreated: "24 May 2026" },
  { company: "Carter Vineyards", clientName: "Elena Carter", email: "elena@cartervineyards.com", address: "Napa, CA 94558", dateCreated: "18 Jun 2026" },
  { company: "Sunridge Orchards", clientName: "Tom Sunridge", email: "tom@sunridge.com", address: "Yakima, WA 98901", dateCreated: "12 Jun 2026" },
  { company: "Del Rio Farms", clientName: "Maria Del Rio", email: "maria@delriofarms.com", address: "Salinas, CA 93901", dateCreated: "07 Jun 2026" },
];

export const SEED_FORMULAS = [
  {
    name: "Mildew Guard Program", productLine: "Prevent", crop: "Wine grapes",
    description: "Preventative powdery-mildew program for vineyards, applied ahead of pressure.",
    targetPests: "Mites", targetDiseases: "Powdery Mildew, Botrytis",
    applicationMethod: "Foliar Spray", dosage: "0.75 gal per acre", unitPrice: 299,
    remedies: "Soil Reset", status: "Active", dateCreated: "10 Jun 2026",
  },
  {
    name: "Root Vigor Starter", productLine: "Strength", crop: "Almonds",
    description: "Early-season germination and root-zone biostimulant program.",
    targetPests: "", targetDiseases: "Root rot",
    applicationMethod: "Drip / Fertigation", dosage: "1 gal per 20 acres", unitPrice: 239,
    remedies: "", status: "Active", dateCreated: "08 Jun 2026",
  },
  {
    name: "Pest Shield Combo", productLine: "Protect", crop: "Lettuce",
    description: "Botanical pest barrier for leafy greens that spares beneficials.",
    targetPests: "Aphids, Whitefly, Beetles", targetDiseases: "",
    applicationMethod: "Foliar Spray", dosage: "1 gal per 25 acres", unitPrice: 279,
    remedies: "", status: "Active", dateCreated: "02 Jun 2026",
  },
];

export const SEED_REMEDIES = [
  { name: "PruebaNueva", description: "Prueba 2026 gianny", recurring: 0, status: "Active", dateCreated: "02 Jun 2026" },
  { name: "Soil Reset", description: "Microbial soil reset between rotations.", recurring: 1, status: "Active", dateCreated: "20 May 2026" },
  { name: "Foliar Rescue", description: "Rapid foliar nutrient correction for stressed canopy.", recurring: 0, status: "Active", dateCreated: "11 May 2026" },
];

export const SEED_ADMINS = [
  { name: "Super Admin", email: "superadmin@agripure.com", status: "Active", dateCreated: "10 Jun 2026" },
  { name: "Super Admin", email: "superadmin@mdx.com", status: "Active", dateCreated: "09 Jun 2026" },
  { name: "Admin mdx", email: "admin@mdx.so", status: "Active", dateCreated: "24 May 2026" },
];

export const SEED_TEAM = [
  { name: "John Alexander", role: "Founder & CEO", status: "Active", sort: 1 },
  { name: "Alex", role: "Head of Research", status: "Active", sort: 2 },
  { name: "Tim", role: "Sales", status: "Active", sort: 3 },
  { name: "John", role: "Manager", status: "Active", sort: 4 },
  { name: "Tim", role: "Sales", status: "Active", sort: 5 },
  { name: "John", role: "Manager", status: "Active", sort: 6 },
];

export const SEED_PROVEN = [
  { title: "Corn yield uplift", metric1Label: "Yield", metric1Value: "+38%", metric2Label: "Pest Loss", metric2Value: "-70%", linkedOrder: "Order 1", status: "Active", description: "Season-long program on dryland corn." },
  { title: "Vineyard protection", metric1Label: "Yield", metric1Value: "+24%", metric2Label: "Disease", metric2Value: "-55%", linkedOrder: "Order 2", status: "Active", description: "Preventative mildew program on wine grapes." },
  { title: "Greenhouse trial", metric1Label: "Yield", metric1Value: "+31%", metric2Label: "Pest Loss", metric2Value: "-60%", linkedOrder: "Order 3", status: "Active", description: "Controlled-environment vegetable trial." },
];

export const SEED_FAQS = [
  {
    section: "contact", product: "No", status: "Active",
    questions: [
      { q: "How fast do you respond to inquiries?", a: "Within one business day from our agronomy team." },
      { q: "Do you offer on-site consultations?", a: "Yes — for verified operations within our service regions." },
    ],
  },
  {
    section: "about", product: "No", status: "Active",
    questions: [
      { q: "Are your inputs OMRI-listed?", a: "Our chemistry is OMRI-style and copper-free." },
      { q: "Where are you based?", a: "Our field office is in Napa, CA." },
    ],
  },
];

// Workflow attributes layered onto the seeded orders (keyed by order id suffix order).
export const ORDER_WORKFLOW: { payment: string; lab: string; recurring: number; items: number }[] = [
  { payment: "Paid", lab: "In Production", recurring: 1, items: 2 },
  { payment: "Paid", lab: "Completed", recurring: 0, items: 2 },
  { payment: "Paid", lab: "Shipped", recurring: 1, items: 2 },
  { payment: "Pending", lab: "Queued", recurring: 0, items: 2 },
  { payment: "Pending", lab: "Queued", recurring: 0, items: 1 },
  { payment: "Paid", lab: "Completed", recurring: 1, items: 2 },
  { payment: "Refunded", lab: "Cancelled", recurring: 0, items: 2 },
  { payment: "Failed", lab: "Cancelled", recurring: 0, items: 2 },
  { payment: "Paid", lab: "Shipped", recurring: 1, items: 2 },
  { payment: "Paid", lab: "Completed", recurring: 0, items: 1 },
];
