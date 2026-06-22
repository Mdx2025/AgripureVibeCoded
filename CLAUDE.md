# AgriPure E-Commerce Redesign

This project is a **design handoff** for a full redesign of the AgriPure e-commerce
experience. AgriPure makes natural pesticides, fungicides, and nutrients, custom-formulated
per crop/soil/pressure using "potentized nano particles."

## Current state
Scaffolded **Next.js 14 (App Router) + TypeScript + Tailwind**. **All three surfaces built
and verified** — production `next build` passes (19 routes), tsc clean.

Run it: `npm run dev` → http://localhost:3000 · dashboard at `/admin`.

Three surfaces (per handoff):
1. **Storefront** — ✅ home, products, PDP, pricing, **order-now (quote flow)**, **account
   portal**, about, learn, contact, sign-in. (Legacy cart/checkout/CartDrawer/cart-store
   were **removed** — purchase model is quote-to-order.)
   - **Customer accounts:** `/sign-in` is the real customer login (`POST /api/account/login`
     → `ap_customer` cookie). `/account` portal lists the signed-in account's quotes/orders
     (`middleware.ts` guards it → `/sign-in?next=`). After a quote, the temp password shows
     once via `NewAccountNotice` (sessionStorage) so the account is usable before email.
   - **Integrations** (`src/lib/integrations.ts`, key-gated via REST, no SDK deps; `.env.example`):
     **Resend** email (quote link + login on submit), **Stripe Checkout** (card; PaymentPanel
     redirects to the returned URL), **Plaid** link-token (ACH). All no-op stubbed without keys;
     add `RESEND_API_KEY` / `STRIPE_SECRET_KEY` / `PLAID_*` to `.env.local` to go live.
     Wire-transfer bank details in `PaymentPanel.tsx` are still placeholders — replace with real.
   - **Purchase model:** products are sold only as one 7-product program, priced by acreage.
     **/shop** is titled **Products** (no per-product pricing, no add-to-cart; cards → PDP;
     `ProductCard`/`ProductDetail` show an "Order Now" CTA). Nav cart pill → distinct
     **leaf-green "Order Now"** button → `/order-now`.
   - **/order-now** (`components/order/OrderWizard.tsx`): 8-step custom-formulation wizard —
     crops (autocomplete multi-select + custom, `MultiCombobox`), acres/crop (input+slider),
     soil, weeds, pests/crop, viral-fungal/crop, yield/crop (each with "No known …"), then
     customer info. Option lists in `lib/order-options.ts`. `/find-your-formula` 307-redirects here.
   - **Quote+account:** submit → `POST /api/quotes` → `createQuote` (repo) upserts a customer
     **account** (temp password) + a **quote** (`AP-Q-#####`) in SQLite, prices via graduated
     `lib/pricing.ts`. View at **/order-now/quote/[id]** — operation summary, pressures,
     pricing breakdown, savings, account banner.
   - **Payment** (`components/order/PaymentPanel.tsx`, tier by total): <$25k card (Stripe),
     $25k–$50k ACH (Plaid), >$50k wire/check (shows wire details). **Stubbed** — `POST
     /api/quotes/[id]/order` records the order as pending; real charging needs STRIPE_*/PLAID_*
     env keys. **Save as PDF** = `window.print()` (chrome has `print:hidden`); **email login +
     quote** is stubbed (needs an email provider key, e.g. RESEND_API_KEY).
   - **/pricing** (`src/app/pricing/page.tsx`): comparison table — Conv $205 / Org $385 /
     AgriPure (volume rate **$359/ac at 500 ac** featured at top; list $399.90, floor $319)
     with a ✓/✗/– "what's included" matrix + per-function $ + list total; then bundle cards
     (Starter $11,995 / Pro $19,995 / Enterprise from $319); then an **acreage calculator**
     (`src/components/PricingCalculator.tsx`, client) — 25-ac increments, **graduated banded
     pricing** (0–50 $399, 50–150 $379, 150–300 $359, 300–500 $339, 500+ $319), shows total,
     effective $/ac, band breakdown, bundles needed, and savings vs organic. All numbers from
     `AgriPure_Pricing_Model.xlsx` (Cost Comparison + Acreage Pricing tabs). In Nav + Footer.
2. **Admin dashboard** — ✅ under `/admin/*`, built to parity with the reference backend
   (agripure-dashboard.apps.mdxpreview.xyz). Sidebar = two groups:
   - **NAVIGATION:** Dashboard, Orders, Clients, Products, Formulas, Remedies
   - **SUPER ADMIN:** Admin, Proven in the field, Team, FAQs, Settings
   Topbar has search, a notifications dropdown, and a region/currency selector.
   - **Dashboard** — quick-nav cards + "Received this month" revenue widget (sum of Paid
     orders), plus KPIs, revenue chart, category split, recent orders, inventory watch.
   - **Orders** ("Client Purchase History") — Payment + Lab Production pills, Items,
     Recurring; filters (Date / Payment / Lab Production / Amount) + Recurring·All toggle +
     row detail modal.
   - **Products** — card grid + inline price/stock edit + Add (CRUD).
   - **Clients / Formulas / Remedies / Admins / Team / Proven / FAQs** — all DB-backed CRUD.
   Shell = `src/components/admin/AdminShell.tsx`. The 7 generic modules render via
   `components/admin/EntityManager.tsx` (table or card view, search/filters, add/edit/delete
   modal, qa repeater for FAQs) configured in `components/admin/managers.tsx`. Storefront
   Announcement/Nav/Footer auto-hide on `/admin`.
3. **3D hero** — `src/components/experience/Experience3D.tsx` owns the overlays + driver
   selection. Driver order:
   - **Real drone footage** (`/public/hero/hero.mp4`) → `videoHero.ts`: autoplay-loop
     real coastal-vineyard aerial (Mixkit clip #8197, free commercial license) drawn to
     canvas + shown as `<video>`, with the 7-step overlays paced on scroll. This is the
     current photoreal hero. **Swap the footage** by replacing `public/hero/hero.mp4`.
   - **Pre-rendered frame sequence** (`/hero/frames/manifest.json`) → `scrubber.ts`.
   - **Fallback: live WebGL vineyard** → `scene.ts` (on video `error`, or if hero.mp4 absent).
   Shared beats in `src/lib/hero-timeline.ts`. Honors `prefers-reduced-motion`.
   - ⚠️ The video hero could NOT be visually verified in the build sandbox's automation
     browser (it can't decode H.264 / composite `<video>` — the native player only showed a
     spinner). It builds clean and works in mainstream browsers; verify in a normal Chrome.
   - **Scene = Central Coast (CA) coastal-ranch vineyard:** warm golden-hour light, golden
     rolling hill mounds, scattered low-poly live oaks, and a painted Pacific-ocean + far-hills
     horizon backdrop (`coastTex` on a fog-disabled cylinder). The hero plant is a grapevine
     (trunk → trellis cordon → grape-leaf canopy → clusters that flower at step 6 and set
     purple fruit at step 7); vineyard rows (instanced) recede over the hills. Tune via
     `buildPlant()`, the vineyard-rows block, `coastTex`, the hill mounds, and the sky/sun/fog
     in `scene.ts`. The Blender target (`agripure_vineyard.py`) mirrors this: `make_ocean` +
     `make_hills` + coastal golden-hour HDRI notes.
   - **Photoreal path (chosen route: pre-rendered scrub):** `Experience3D.tsx` fetches
     `/hero/frames/manifest.json` on load — if present it uses `experience/scrubber.ts`
     (canvas image-sequence scrubber, photoreal); if absent it falls back to the live
     `scene.ts` WebGL vineyard. Both share `src/lib/hero-timeline.ts` so overlays stay in
     sync. To go photoreal: render frames in Blender (`design-handoff/blender/agripure_vineyard.py`
     keyframes the exact camera move + a Control rig for the 7 beats), encode with
     `scripts/build-hero-frames.mjs` into `public/hero/frames/` + manifest. Full pipeline:
     `design-handoff/hero/README.md`. Nothing else changes — the scrub activates automatically.
   - `src/components/Hero.tsx` is the old 2D placeholder, kept as a no-WebGL fallback (unused).

### Why Next.js 14 (not 16)
The machine's default `node` is v18.20.8 (nvm); Next 15/16 need Node ≥20.9. Pinned to Next
14 so the dev server runs on the existing toolchain. Homebrew has Node v22 — switch the
default to Node 20+ and we can bump to Next 16 + React 19.

### Backend / persistence (SQLite)
- **DB:** better-sqlite3 at `data/agripure.db` (gitignored, WAL). `src/lib/db.ts` opens a
  singleton, creates schema, and seeds products/customers/orders/settings on first run from
  the constants in `products.ts` + `admin-data.ts`. Delete `data/` to re-seed (restart the
  dev server first so it drops the open handle). `better-sqlite3` is in
  `serverComponentsExternalPackages` (next.config.mjs) so it isn't bundled.
- **Repository:** `src/lib/repo.ts` — product/order/settings functions plus a generic `crud()`
  factory exposing `ENTITIES` + typed `list*` for clients/formulas/remedies/admins/team/
  proven/faqs. `createOrder` computes total from live prices, draws down stock, generates the
  next `#AP-…` id, and stamps payment/lab/recurring/items. Seed data for the new modules is in
  `src/lib/seed-extra.ts`.
- **API routes** (`src/app/api/*`, all `force-dynamic`): `GET /api/products` + `POST` (admin),
  `GET|PUT /api/products/[id]` (+DELETE via repo), `GET /api/orders?status=` + `POST`,
  `GET|PUT /api/settings`, `GET /api/customers`, auth `login`/`logout`, and a **generic**
  `GET|POST /api/admin/[entity]` + `GET|PUT|DELETE /api/admin/[entity]/[id]` covering all 7
  dashboard modules. All admin writes require the session cookie (`isAdmin`).
- **Wiring:** checkout `POST`s the cart to `/api/orders` (shows the real `#AP-…` on the
  confirmation). Dashboard pages are now `force-dynamic` and read the repo directly
  (server components) — orders/overview/products/customers reflect live DB; settings page
  loads via `GET` and saves via `PUT`. Placing an order decrements stock visible on
  `/admin/products` + the overview inventory watch.
- **Catalog is DB-driven:** home, shop, PDP, and find-your-formula are `force-dynamic` server
  pages that read products from the repo and pass them to client components
  (`ShopGrid`, `ProductDetail`, `FormulaFinder`). The **cart is decoupled** from the catalog —
  `cart-store.ts` lines snapshot name/price/accent at add-time (`add(product,size,qty)`), so
  cart/drawer/checkout need no product lookup. Admin product edits show on the storefront on
  next load.
- **Product CRUD:** `POST /api/products` (create) + `PUT /api/products/[id]` (edit price/stock/
  fields), backed by `createProduct`/`updateProduct` in repo.ts. Admin UI =
  `components/admin/ProductsManager.tsx` (inline price/stock edit + Add form; `router.refresh()`
  after writes). New products auto-get id/num/SKU; note they have no bottle/label art until
  images are added to `public/assets/`.
- **Auth (demo-grade):** `src/lib/auth.ts` holds a single shared credential
  (`superadmin@agripure.com` / `agripure`) + an opaque cookie. `src/middleware.ts` redirects
  any `/admin/*` (except `/admin/sign-in`) to sign-in without the cookie; mutating admin APIs
  (products POST/PUT, settings PUT) re-check via `isAdmin()`. Login/logout =
  `/api/auth/login` + `/api/auth/logout`. Replace with real user accounts + signed/JWT
  sessions + hashed passwords for production.
- **Note:** the SQLite file is local disk — fine for dev, but a serverless deploy needs a
  hosted DB. Storefront auth (`/sign-in`) is still UI-only; only the admin dashboard is gated.

### Structure
- `src/lib/products.ts` — typed product data, sizes, pricing/related helpers, asset src helpers.
- `src/lib/cart-store.ts` — Zustand cart + `cartTotals`. `src/lib/format.ts` — money + freight.
- `src/lib/{db,repo}.ts` — persistence + data access. `src/lib/admin-data.ts` — seed data + status helpers.
- `src/components/` — Announcement, Nav, Footer, CartDrawer, ProductCard, Hero, Stars; `admin/*`; `experience/*`.
- `src/app/` — route pages + `api/*` handlers. `globals.css` + `tailwind.config.ts` hold the design tokens.
- `public/assets/` — all product/brand images.

## Target stack (from the handoff)
- **Next.js (App Router) + React + TypeScript**
- Styling: Tailwind or CSS Modules
- Fonts via `next/font/google`: **Nunito** (display), **Hanken Grotesk** (body/UI),
  **JetBrains Mono** (numbers/SKUs/overlines)
- Icons: **lucide-react**
- Cart state: Zustand or React Context — shape `[{id,size,qty}]`
- 3D hero: React Three Fiber stack OR pre-rendered image-sequence (see `EXPERIENCE_3D.md`)

## What's in this bundle
- `README.md` — full handoff: design tokens (color/type/spacing), every screen spec, state model, routes.
- `EXPERIENCE_3D.md` — detailed spec + photoreal build plan for the scroll-driven 3D hero.
- `prototypes/*.dc.html` — self-contained HTML design references (source of truth for layout,
  spacing, color, type, copy, interaction). **Recreate idiomatically in Next.js — do not copy line-for-line.**
- `data/products.js` — canonical product data (7 products) + sizes. Seed the DB/CMS from this.
- `assets/` — bottles, labels, botanical illustrations, logos/marks (ids: restore, cleanse,
  strength, grow, protect, prevent, boost).

## Key references
- Design tokens, screen specs, routing, cart math: see `README.md`.
- 3D hero timeline, step copy, overlay styling: see `EXPERIENCE_3D.md`.
- Routes: `/`, `/shop`, `/products/[id]`, `/cart`, `/checkout`, `/find-your-formula`,
  `/about`, `/learn`, `/contact`, `/sign-in`; dashboard under `/admin/*`.

## Building notes
- Prototypes reference a design-system stylesheet (`_ds/...colors_and_type.css`) that is **not**
  bundled — all token values are reproduced in `README.md`. The hero proto loads Three.js r128 from CDN.
- Prices ($219–$299) are placeholders — confirm with client.
- Dashboard mock data is inline in its prototype's logic class — replace with a real API.
