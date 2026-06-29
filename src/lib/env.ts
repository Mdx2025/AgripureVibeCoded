import { z } from "zod";

// Zod-validated server environment. Throws early (at first import) with a clear
// message if a required var is missing/invalid. Set SKIP_ENV_VALIDATION=1 to
// bypass during `next build` in CI (where runtime secrets aren't present).
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Database (Neon) — pooled for runtime, direct for migrations.
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (Neon pooled connection string)"),
  DATABASE_URL_UNPOOLED: z.string().optional(),

  // Auth.js (admin login)
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 chars (generate: openssl rand -base64 32)"),
  AUTH_TRUST_HOST: z.string().optional(),

  // Optional integrations — features stay stubbed until set.
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.string().optional(),
  SENTRY_DSN: z.string().optional(),

  // Media (Cloudflare R2) — Phase 2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  NEXT_PUBLIC_MEDIA_BASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

function load(): Env {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`\n❌ Invalid environment variables:\n${issues}\n`);
  }
  return parsed.data;
}

export const env = load();
