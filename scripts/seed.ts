// Seed a fresh database (no-op on already-populated tables).
//   npm run db:seed
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .then(() => { console.log("Seed complete."); process.exit(0); })
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); });
