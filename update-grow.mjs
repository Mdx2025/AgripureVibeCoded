import Database from "better-sqlite3";
import path from "node:path";
const db = new Database(path.join(process.cwd(), "data", "agripure.db"));
const info = db.prepare(`UPDATE products SET
  category=@category, type=@type, tagline=@tagline, blurb=@blurb, long=@long
  WHERE id='grow'`).run({
  category: "Growth & Plant Health",
  type: "Foliar Nutrient & Plant-Health Tonic",
  tagline: "Drives vigorous growth while targeting the plant-health problems your specific crop faces.",
  blurb: "Vegetative driver and crop-specific health tonic — a lush, balanced canopy plus targeted support for the deficiencies and stresses your crop is prone to.",
  long: "Grow does two jobs at once. It fuels the vegetative phase with a balanced nutrient-and-biostimulant profile that builds canopy and leaf area without forcing soft, disease-prone tissue — and it's tuned to the plant-health problems your specific crop faces, from micronutrient deficiencies and abiotic stress to the physiological disorders common to your variety. The result is fast, resilient growth that's strong exactly where your crop is usually weakest.",
});
console.log("rows updated:", info.changes);
console.log(JSON.stringify(db.prepare("SELECT id,name,category,type,tagline FROM products WHERE id='grow'").get(), null, 2));
db.close();
