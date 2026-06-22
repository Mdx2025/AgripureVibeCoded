# Handoff: AgriPure E-Commerce Redesign (Storefront + Dashboard + 3D Hero)

## Overview
A full redesign of the AgriPure e-commerce experience, themed from the new product-label
system (warm paper, forest/leaf greens, vintage-botanical product art). It covers three surfaces:

1. **Storefront** — marketing + shop (home, catalog, product detail, cart/checkout, formula
   finder, about, learn, contact, auth).
2. **Admin dashboard** — overview/analytics, orders, products/inventory, customers, settings, sign-in.
3. **3D hero experience** — a scroll-driven WebGL scene that flies into a farm and applies all
   seven products to one plant, step by step (drip + mist + threats clearing + plant greening).

The brand: AgriPure makes natural pesticides, fungicides, and nutrients, custom-formulated per
crop/soil/pressure, using "potentized nano particles."

## About the Design Files
The files in `prototypes/` are **design references created in HTML** (authored as single-file
"Design Components" — streaming HTML + an embedded React-style logic class). They are **prototypes
showing intended look and behavior, not production code to copy line-for-line.**

Your task is to **recreate these designs in the target codebase** — the user wants **React + Next.js**
(App Router). Use Next.js conventions, a real component structure, and proper state/data layers.
Treat the HTML as the source of truth for layout, spacing, color, type, copy, and interaction —
then implement idiomatically.

> The prototypes reference design tokens from an AgriPure design-system stylesheet
> (`colors_and_type.css`) and assets in `assets/`. All tokens you need are reproduced in
> **Design Tokens** below, and all assets are bundled in `assets/`.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all
specified. Recreate the UI faithfully. The one exception is the 3D hero, which is an
**approved real-time prototype** of the *choreography and content*; the user wants it taken to
**photoreal** quality in the real build — see **§ 3D Hero Experience** for the build plan.

---

## Tech Stack (target)
- **Next.js (App Router) + React + TypeScript**
- Styling: Tailwind or CSS Modules — either is fine; tokens below map cleanly to both.
- Fonts: **Nunito** (display/headings 700–900), **Hanken Grotesk** (body/UI), **JetBrains Mono**
  (numbers, prices, SKUs, specs, overlines). Load via `next/font/google`.
- Icons: **Lucide** (`lucide-react`). The prototypes hand-rolled equivalent SVGs.
- Cart state: client store (Zustand or React Context). Prototype keeps `[{id,size,qty}]`.
- 3D hero: **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`) + GSAP `ScrollTrigger` (or `drei` ScrollControls) — OR a
  pre-rendered video / image-sequence approach (see § 3D Hero).
- Images: `next/image` with the bundled product renders.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| green-50 / **Mint** | `#EDF6F3` | (DS mint; storefront uses warm paper below instead) |
| green-100 | `#DFEEDA` | soft tint fills |
| green-500 / **Leaf** | `#6FAE52` | primary accent, CTAs (leaf), success |
| green-600 | `#538B3C` | leaf hover, links |
| green-700 | `#356A26` | icon green |
| green-800 / **Forest** | `#004800` | headings, dark fills |
| **Forest (UI)** | `#063A12` | primary heading/text-brand + primary button fill |
| green-950 / **Canvas** | `#001706` | darkest surfaces (footer, announcement, sidebar `#04210B`) |
| **Paper (canvas)** | `#EDEAE0` | storefront page background (warm greige, label paper) |
| **Paper-2 / card-on-dark** | `#F4F1E8` | inset panels |
| surface white | `#FFFFFF` | cards |
| ink | `#1E251F` | body text |
| fg-2 (secondary) | `#5A6157` / `#4A524B` | secondary text |
| fg-3 (muted) | `#8A958B` / `#A6A293` | hints, captions |
| border | `#E2DFD2` / `#D9D6C7` | hairlines (warm) |
| border-strong | `#C7CBB8` | outlines, pill buttons ghost |

**Per-product accent colors** (used on cards/PDP/badges/3D panel):
| # | Product | Category | Accent | Soft tint |
|---|---|---|---|---|
| 01 | Restore | Soil Restoration & Health | `#4E8A3A` | `#E9F0E0` |
| 02 | Cleanse | Weed Seed Growth Inhibitor | `#BE8A1E` | `#F4ECD6` |
| 03 | Strength | Seed Germination & Root Stimulant | `#2F6FB0` | `#E2ECF5` |
| 04 | Grow | Growth Stimulant | `#5BA03C` | `#E8F2DE` |
| 05 | Protect | Pesticide (Biopesticide) | `#C0531C` | `#F4E2D6` |
| 06 | Prevent | Fungicide (Biofungicide) | `#6E4FA0` | `#EAE4F2` |
| 07 | Boost | Yield Enhancer | `#B8860B` | `#F4ECD6` |

**Status colors (dashboard):** Processing `#2F6FB0`/bg`#E2ECF5`, Shipped `#538B3C`/bg`#E9F0E0`,
Delivered `#356A26`/bg`#E9F0E0`, Pending `#C97A06`/bg`#FBEFD9`, Cancelled `#B23A1E`/bg`#F8E3DC`.

**Gradients:** aurora `radial-gradient(120% 90% at 50% 120%, #BFE89A 0%, #6FAE52 32%, #063210 78%, #001706 100%)`;
forest `linear-gradient(160deg,#063A12 0%,#001706 100%)`.

### Typography
- Display/H: Nunito — weights 800–900, `letter-spacing:-0.02em`, line-height 1.0–1.12.
  Scale used: hero 72–84px, h1 48–56px, h2 36–48px, h3 21–28px.
- Body/UI: Hanken Grotesk — 400/500/600/700; body 15–17px, line-height 1.6.
- Mono: JetBrains Mono — numbers, prices, SKUs, specs, overlines (12–13px, `letter-spacing:.06–.22em`,
  often uppercase for overlines).

### Spacing / Radius / Shadow / Motion
- Spacing base 4px: 4/8/12/16/24/32/48/64/96.
- Radius: cards `18px` (lg) / `20–26px` large panels; inputs/chips `10–14px`; **buttons are full pills `999px`** (brand signature); thumbnails `12px`.
- Shadow (green-tinted): sm `0 1px 3px rgba(0,40,8,.06)`, md `0 4px 12px rgba(0,40,8,.08)`,
  lg `0 12px 32px rgba(0,40,8,.12)`, xl `0 24px 60px rgba(0,40,8,.18)`.
- Motion: fades + 8–16px rises, 120–360ms, ease `cubic-bezier(.16,1,.3,1)`. No bounce on buttons.
- Buttons: primary = Forest `#063A12` fill / white text, hover `#004800`; leaf = `#6FAE52`,
  hover `#8BC06F`/`#538B3C`; ghost = `1.5px #C7CBB8` outline on white. All pills, 200ms.

---

## Product Data
Canonical data is in `data/products.js` (id, num, name, category, type, accent, accentSoft,
price, sku, rating, reviews, stock, tagline, blurb, long description, N-P-K, pH, OMRI, rate,
crops, botanical image). Use it to seed your products table/CMS. Sizes: 1 Gallon (×0.22 price,
"Trial"), 6 Gallon (×1, "Standard · 22.7 L"), 55 Gallon Drum (×8.4).

Prices are realistic **placeholders** ($219–$299) — confirm with the client.

---

## Storefront — Screens

**Global chrome:** announcement bar (Canvas `#001706`, mint text) → sticky translucent nav
(`rgba(237,234,224,.86)` + blur, 74px tall): forest logo, links (Shop, Find your formula, Learn,
About, Contact), Account, pill Cart button with count badge → page → Canvas footer with link
columns → slide-over **cart drawer** (420px, right, overlay `rgba(0,23,6,.45)`).

- **Home** — the 3D hero experience (§ below) replaces the old hero, then: "The Seven" product
  strip (7 numbered cards → PDP), 3 feature cards, dark forest "Boost" spotlight band, formula-finder
  teaser, aurora CTA. Section padding ~96px; container max-width 1240px.
- **Shop** — header + category filter pills (All/Soil/Growth/Protection/Yield) + sort select;
  3-col grid of product cards. Card: bottle on `accentSoft` radial, No. + type badge, name, category,
  blurb, price (mono) + round add-to-cart (+) button.
- **Product detail (PDP)** — sticky gallery (bottle/label/botanical thumbs) on `accentSoft` panel;
  right: No. + type, name (56px), category, star rating, long copy, price, **size selector** (3 pills),
  qty stepper, Add to cart (shows line total), trust row, spec grid (N-P-K, pH, rate, SKU), crop chips,
  "Pairs well with" related (3).
- **Cart page** — line items (image, name, size, qty stepper, line total, remove) + sticky summary
  (subtotal, freight: free ≥ $750 else $85, total) → Checkout.
- **Checkout** — 3-step stepper (Information → Delivery → Payment) + order summary sidebar; final
  step → confirmation state (order number `#AP-…`, cart cleared).
- **Formula finder** — crop chips, pressure chips, acreage slider → live "custom program" card
  (dark forest/aurora) listing 2–3 recommended products with roles, rates, per-product cost,
  season total, formula code (e.g. `AP-WG-PM-1280`), "Add program to cart".
- **About / Learn / Contact / Auth** — story + stats + values; article grid; contact form + info;
  split-panel sign-in/register (forest panel + bottle, toggling copy).

## Dashboard — Screens
Dark forest sidebar (`#04210B`, 248px) with logo, nav (Overview/Orders/Products/Customers/Settings,
Lucide icons, active = `rgba(111,174,82,.16)`), user + sign-out → topbar (page title, search, bell)
→ content on paper `#EDEAE0`.
- **Overview** — 4 KPI cards (Revenue/Orders/AOV/Customers + trend), 12-month revenue bar chart,
  sales-by-category bars, recent-orders table, inventory-watch list (stock bars).
- **Orders** — status filter tabs + table (order#, customer/op, items, date, total, status pill).
- **Products** — table (image, No.+name, SKU, category, price, stock bar, Active/Low-stock pill) + Add.
- **Customers** — table (avatar+name+op, location, crop, orders, LTV).
- **Settings** — store profile inputs, toggle rows (custom pill switches), Save.
- **Sign-in** — centered branded card over aurora.
Mock data (orders, customers, KPIs) is inline in the dashboard prototype's logic class — replace with API.

## Interactions & State
- **Cart**: `[{id,size,qty}]`. add (opens drawer), setQty, remove. unitPrice = `round(price*sizeFactor)`.
  subtotal = Σ line; freight = subtotal>0 && <750 ? 85 : 0; count = Σ qty.
- **Routing**: prototypes use an internal state router; in Next.js use real routes
  (`/`, `/shop`, `/products/[id]`, `/cart`, `/checkout`, `/find-your-formula`, `/about`, `/learn`,
  `/contact`, `/sign-in`; dashboard under `/admin/*`).
- **Formula finder**: pressure→primary product map; build a 2–3 product program; qty ≈ `max(1, round(acres/40))`.
- Hover: cards rise 6px; buttons darken one step (200ms). Pills, green-tinted shadows throughout.

## Assets (bundled in `assets/`)
- `bottles/<id>.png` — 7 product **bottle renders** (label wrapped on a matte-green 6-gal carboy).
  These were composited from the flat labels onto `carboy-green.png`.
- `labels/<id>.png` — 7 flat label artworks (the approved label designs).
- `botanical/<id>.png` — 7 botanical illustrations (per product).
- `logo-forest.png`, `logo-white.png` — Agripure wordmark lockups (transparent).
- `mark-forest.png`, `mark-leaf.png`, `mark-white.png` — seed-burst mark.
- `carboy-green.png` — blank matte-green carboy (for re-compositing if needed).
ids: `restore, cleanse, strength, grow, protect, prevent, boost`.

## Files in this bundle
- `prototypes/AgriPure Storefront.dc.html` — full storefront (all screens + cart + 3D hero embed).
- `prototypes/AgriPure Dashboard.dc.html` — full admin dashboard.
- `prototypes/AgriPureExperience.dc.html` — the 3D scroll hero (Three.js r128).
- `data/products.js` — canonical product data module.
- `assets/` — all images.
- `EXPERIENCE_3D.md` — **the detailed spec + photoreal build plan for the 3D hero. Read this for the hero.**

To preview a prototype: the `.dc.html` files are self-contained except they reference an AgriPure
design-system stylesheet (`_ds/...colors_and_type.css`) and (for the hero) a Three.js CDN script.
Use them as visual reference; all token values are in this README.
