# Moving AgriPure to a new computer

This archive is the **complete** AgriPure project — Next.js front end, the SQLite
backend, all media assets, and the full git history/remote. The only things left
out are regenerable: `node_modules` and the `.next` build cache.

## What's inside
- `src/` — all app + component code (storefront, admin dashboard, API routes)
- `public/` — images, bottle/label renders, photos, and the explainer/field videos
- `data/agripure.db` — **your live database**: products, pricing program, SEO config,
  orders, quotes, clients, crop formulas, etc. Keep this file — it's your backend content.
- `.git/` — full history, already wired to `https://github.com/curranabell/agripure.git`
- config: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`,
  `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `.env.example`

## Requirements on the new machine
- **Node.js 22.x** (this was built on v22.22.2) and npm
- macOS, Linux, or Windows (WSL recommended on Windows)

## First-time setup (3 commands)
```bash
cd AgriPure
npm install
npm rebuild better-sqlite3     # IMPORTANT: native module — must be rebuilt for this machine's Node
```

## Run it
```bash
npm run dev      # development → http://localhost:3000
```
(On the previous machine the Claude Code preview ran it on port 3200; a plain
`npm run dev` uses 3000. To match: `PORT=3200 npm run dev`.)

Production build:
```bash
npm run build && npm start
```

## Admin dashboard
- URL: `/admin`  ·  demo login: `superadmin@agripure.com` / `agripure`
- (Change this before any public deploy — it's a demo credential.)

## Optional integrations (all stubbed by default)
Copy `.env.example` → `.env.local` and fill in keys to turn these live:
- **Resend** — emails the quote link + account login when a quote is submitted
- **Stripe** — card checkout (orders < $25k)
- **Plaid** — bank/ACH (orders $25k–$50k)
Everything runs fine with no keys; adding a key activates that path.

## Git / GitHub
The remote is already set, so on the new machine you can:
```bash
git status
git pull        # if you pushed anything from elsewhere
git push        # publish your changes
```
Note: the automatic "push on every change" behavior came from a Claude Code hook on
the old machine; it won't follow the codebase. Normal `git add/commit/push` works as usual.

## Gotchas
- **better-sqlite3 is a native module.** If you ever change Node versions, re-run
  `npm rebuild better-sqlite3`, or you'll see a `NODE_MODULE_VERSION` mismatch error.
- The app needs a **writable filesystem** (file-based SQLite at `data/agripure.db`),
  so it runs on a normal Node host — not on serverless (Vercel/Netlify) without first
  swapping the DB to a hosted one (e.g. Turso/libSQL or Postgres).
- `data/agripure.db-wal` / `-shm` are transient runtime files (git-ignored); the `.db`
  file alone is the source of truth.

## Alternative: skip the archive entirely
Because the repo is fully pushed, on the new machine you could instead just:
```bash
git clone https://github.com/curranabell/agripure.git
cd agripure && npm install && npm rebuild better-sqlite3 && npm run dev
```
The clone includes the committed `data/agripure.db` snapshot too, so you'd be at the
same state. Use the archive if you want it offline / without cloning.
