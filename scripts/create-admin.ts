// Create or update an admin login (hashed password + role).
//
//   npm run admin:create -- --email you@agripure.com --password 'S3cret!' --name "Your Name" --role superadmin
//
// Roles: superadmin | admin  (default: admin)
import "./load-env"; // must be first — populates env before repo/db/env load
import bcrypt from "bcryptjs";
import { setAdminCredentials } from "../src/lib/repo";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const email = arg("email");
const password = arg("password");
const name = arg("name");
const role = (arg("role") || "admin").toLowerCase();

if (!email || !password) {
  console.error("Usage: npm run admin:create -- --email <email> --password <password> [--name <name>] [--role superadmin|admin]");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}
if (role !== "admin" && role !== "superadmin") {
  console.error("Role must be 'admin' or 'superadmin'.");
  process.exit(1);
}

(async () => {
  const passwordHash = await bcrypt.hash(password, 12);
  const res = await setAdminCredentials({ email, name, passwordHash, role });
  console.log(`✅ Admin ready: ${res.email} (role: ${res.role})`);
  process.exit(0);
})().catch((e) => { console.error("Failed:", e); process.exit(1); });
