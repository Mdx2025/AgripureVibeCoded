// Curated option lists for the Order Now custom-formulation wizard. Users can
// also type custom entries not in these lists.

export const CROPS = [
  "Wine grapes", "Table grapes", "Almonds", "Walnuts", "Pistachios", "Lettuce", "Tomatoes",
  "Strawberries", "Blueberries", "Corn", "Soybeans", "Wheat", "Rice", "Cotton", "Cannabis",
  "Hemp", "Hops", "Citrus", "Oranges", "Lemons", "Avocados", "Apples", "Cherries", "Peaches",
  "Peppers", "Carrots", "Onions", "Potatoes", "Broccoli", "Spinach", "Kale", "Melons",
];

export const SOIL_PROBLEMS = [
  "Low organic matter", "Nitrogen deficiency", "Phosphorus deficiency", "Potassium deficiency",
  "Low pH (acidic soil)", "High pH (alkaline soil)", "Poor drainage", "Soil compaction",
  "Salinity / salt buildup", "Low microbial activity", "Iron deficiency", "Zinc deficiency",
  "Magnesium deficiency", "Calcium deficiency", "Sulfur deficiency", "Boron deficiency",
  "Erosion", "Low water retention", "Sodic soil", "Crusting",
];

export const WEEDS = [
  "Pigweed", "Lambsquarters", "Field bindweed", "Crabgrass", "Foxtail", "Nutsedge",
  "Johnsongrass", "Marestail (horseweed)", "Kochia", "Velvetleaf", "Common ragweed",
  "Barnyardgrass", "Dandelion", "Purslane", "Chickweed", "Morningglory", "Canada thistle",
  "Quackgrass", "Wild oat", "Cheatgrass", "Russian thistle", "Bermudagrass",
];

export const PESTS = [
  "Aphids", "Spider mites", "Whiteflies", "Thrips", "Leafhoppers", "Flea beetles",
  "Cucumber beetles", "Colorado potato beetle", "Caterpillars / loopers", "Armyworms",
  "Cutworms", "Corn earworm", "Stink bugs", "Mealybugs", "Scale insects", "Leafminers",
  "Root-knot nematodes", "Grasshoppers", "Codling moth", "Spotted wing drosophila",
  "Vine weevil", "Squash bugs", "Hornworms", "Wireworms",
];

export const DISEASES = [
  "Powdery mildew", "Downy mildew", "Botrytis (gray mold)", "Fusarium wilt",
  "Verticillium wilt", "Rust", "Anthracnose", "Late blight", "Early blight",
  "Pythium root rot", "Phytophthora root rot", "Bacterial spot", "Bacterial blight",
  "Mosaic virus", "Leaf curl virus", "Tomato spotted wilt virus", "Citrus greening (HLB)",
  "Fire blight", "Black rot", "Sclerotinia", "Cercospora leaf spot", "Damping-off",
];

export const NONE = {
  soil: "No known soil problems",
  weeds: "No known weed problems",
  pests: "No known pest problems",
  diseases: "No known disease problems",
} as const;
