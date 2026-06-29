// Side-effect module: load .env.local (then .env) BEFORE any other import is
// evaluated. Import this FIRST in scripts so `src/lib/env.ts` sees the vars
// (ESM hoists imports above inline code, so inline dotenv.config() runs too late).
import { config } from "dotenv";
config({ path: ".env.local" });
config();
