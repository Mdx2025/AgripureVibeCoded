// Create or update an admin login (hashed password + role).
//
// Recommended (prompts for the password — hidden, no shell quoting issues):
//   npm run admin:create -- --email you@agripure.com --role superadmin
//
// Non-interactive (CI): add --password '...' (single-quote it; a "!" in a
// double-quoted/unquoted password triggers zsh history expansion → "no such event").
//
// Roles: superadmin | admin  (default: admin)
import "./load-env"; // must be first — populates env before repo/db/env load
import bcrypt from "bcryptjs";
import { setAdminCredentials } from "../src/lib/repo";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

// Read a line from stdin with the typed characters hidden (TTY) — keeps the
// password off the command line and out of shell history.
function promptHidden(query: string): Promise<string> {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(query);
    const tty = Boolean(stdin.isTTY);
    if (tty) stdin.setRawMode(true);
    stdin.resume();
    let input = "";
    const onData = (chunk: Buffer) => {
      const s = chunk.toString("utf8");
      const code = s.charCodeAt(0);
      if (s === "\n" || s === "\r" || code === 4) {        // Enter / Ctrl-D
        if (tty) stdin.setRawMode(false);
        stdin.removeListener("data", onData);
        stdin.pause();
        stdout.write("\n");
        resolve(input);
      } else if (code === 3) {                              // Ctrl-C
        if (tty) stdin.setRawMode(false);
        stdout.write("\n");
        process.exit(1);
      } else if (code === 127 || code === 8) {              // Backspace / DEL
        input = input.slice(0, -1);
      } else {
        input += s.replace(/[\r\n]/g, "");
      }
    };
    stdin.on("data", onData);
  });
}

(async () => {
  const email = (arg("email") || (await promptHidden("Admin email: "))).trim();
  const name = arg("name");
  const role = (arg("role") || "admin").toLowerCase();

  if (!email) { console.error("An email is required."); process.exit(1); }
  if (role !== "admin" && role !== "superadmin") {
    console.error("Role must be 'admin' or 'superadmin'."); process.exit(1);
  }

  let password = arg("password");
  if (!password) {
    password = await promptHidden("Password (hidden): ");
    const confirm = await promptHidden("Confirm password: ");
    if (password !== confirm) { console.error("Passwords don't match."); process.exit(1); }
  }
  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters."); process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const res = await setAdminCredentials({ email, name, passwordHash, role });
  console.log(`\n✅ Admin ready: ${res.email} (role: ${res.role})`);
  process.exit(0);
})().catch((e) => { console.error("Failed:", e); process.exit(1); });
