# 3D Hero Experience — Spec & Photoreal Build Plan

This is the scroll-driven WebGL hero on the storefront home. The prototype
(`prototypes/AgriPureExperience.dc.html`, Three.js r128) is an **approved real-time mock of the
choreography, content, and copy**. The goal in production is to take it to **photoreal "looks like
a real farm video"** quality. This doc gives you (A) the exact behavior to reproduce, and (B) three
routes to photoreal with concrete libraries/assets.

---

## A. Behavior spec (reproduce exactly)

### Structure
- A tall scroll section (prototype: `height: 880vh`) containing a **sticky 100vh stage**.
- Scroll progress `p = clamp(-sectionTop / (sectionHeight - viewportHeight), 0, 1)`.
- `p` is damped each frame: `cur += (target - cur) * 0.075` for smooth, cinematic motion.
- Overlays (HTML, not in 3D): intro block, product panel (frosted), 01–07 progress rail,
  bouncing "Scroll" cue. All update from `p`.

### Timeline
- **Intro** `p ∈ [0, 0.085]`: camera drone shot descends into the field toward one hero plant.
  - camera pos lerp `(-6, 15, 22) → (sin(-0.55)*5.4, 2.1, 5.4)`, lookAt `(2,1.5,-10) → (0,1.5,0)`,
    eased with smoothstep.
  - Intro overlay opacity = `1 - p/0.085`.
- **Steps** `p ∈ [0.085, 1]`: `seg = (p-0.085)/0.915`; `f = seg*7`; `idx = floor(f)`; `lt = f-idx`.
  - Camera orbits hero: `angle = -0.55 + seg*1.15`, `radius = 5.4 - seg*1.7 - smoothstep(0.2,0.7,lt)*0.5`,
    `height ≈ 1.95 + sin(seg*2π)*0.25`, lookAt `(0,1.45,0)`. (Slow push-in per step.)
  - Per-step sub-phases on `lt`:
    - bottle slides in `[0,0.12]`, holds, slides out `[0.86,1]`; floats on the right (camera-attached).
    - **application** active `≈ smoothstep(0.16,0.30,lt) * (1 - smoothstep(0.64,0.80,lt))` — drives drip,
      mist, and nano-particle convergence.
    - **threats** clear `= smoothstep(0.32,0.66,lt)` — sprites scatter outward (radius ×(1+clear*2.6)),
      fall, and fade.
    - **plant health** `= (idx + smoothstep(0.32,0.72,lt)) / 7` — leaf color lerps sick
      `#b2bb6a → lush #3f8c2c`, emissive + scale rise. Flowers appear at step 6, fruit at step 7.
  - Panel opacity = `clamp(min(lt/0.12, (1-lt)/0.12, 1), 0, 1)` (fade in/out at step edges).
- **Scroll cue** opacity = `1 - smoothstep(0.93, 1, p)` (fades out near the end).

### The 7 steps (exact copy — from the live agripure site)
Each step shows the matching bottle render + this title/description in the frosted panel.

| Step | Bottle id | Title | Threat shown | Accent |
|---|---|---|---|---|
| 01 | restore | Soil Restoration & Health | depleted soil | `#86CC63` |
| 02 | cleanse | Cleanse & Detox | chemical residue | `#E2B43E` |
| 03 | strength | Root Strengthening | weak roots | `#5AA0E0` |
| 04 | protect | Pest Prevention Shield | pests (beetles) | `#E88A4C` |
| 05 | prevent | Disease Defense | virus / spores | `#A98FD6` |
| 06 | grow | Growth Acceleration | stalled growth | `#86CC63` |
| 07 | boost | Harvest Optimization | (none → fruit sets) | `#E2B43E` |

Descriptions (verbatim):
1. "We begin by revitalizing your soil with potent nano particles of nutrients and micro-organisms, tailored to your soil sample report. This essential step lays a healthy foundation for your crops."
2. "We cleanse your soil and crops from harmful residues left by previous chemical treatments, creating a clean environment for natural growth and protection."
3. "Our specialized root-boosting formula promotes deeper, stronger root systems that improve water and nutrient absorption across all crop types."
4. "A natural bio-pesticide barrier is applied to protect your crops from common pests before they can cause damage, reducing crop loss significantly."
5. "We apply targeted disease prevention treatments using potentized nano particles that guard against fungal, bacterial, and viral threats specific to your crops."
6. "Custom nutrient blends are delivered to accelerate healthy growth, improve flowering, and maximize fruit and grain production for your specific crop variety."
7. "The final step ensures your crops reach peak quality at harvest time with a finishing treatment that enhances yield, color, and shelf life."

Hero (intro) copy:
- Overline: `NANO TECHNOLOGY`
- Title: **Natural Pesticides and Nutrients**
- Sub: "We utilize potentized nano particles to provide a seed-to-finish natural pesticide and nutrient solution for crops."
- Chip: "The Best Crop Insurance You Can Buy"

### Overlay styling (for legibility — keep this)
- Product panel: `background: rgba(7,18,9,.62)`, `backdrop-filter: blur(14px)`, `1px rgba(255,255,255,.16)`
  border, radius 22px, padding 30px, shadow `0 24px 60px rgba(0,0,0,.4)`. Left-aligned, ~400px, vertically centered.
- Stage scrims: inset vignette `inset 0 0 220px 40px rgba(6,16,8,.55)`; left gradient
  `rgba(6,16,8,.62) → 0` (0→54%); bottom 200px and top 120px gradients. These keep white text readable
  over the bright sky.
- Scroll cue: bottom-center pill, `Scroll` (mono, tracked, uppercase) + down-chevron, bouncing
  (`translateY 0→9px`, 1.5s ease-in-out infinite).
- Progress rail: right side, vertical 01–07 dots; active = leaf fill + scale 1.15 + glow.

---

## B. Photoreal build plan — pick one route

### Route 1 — Real footage (most convincing, lowest effort) ★ recommended for "real video"
Use an actual drone/crop clip and **scrub it on scroll**, overlaying the steps.
- Acquire: license stock (Artgrid, Pexels, Filmsupply) or shoot a drone fly-in + macro plant shots.
  Ideally one continuous "drone descends into field → settles on one plant" shot for the intro, then
  macro plant footage for the steps.
- Implement (Next.js):
  - Encode to a scrubbable format. For reliable scrubbing, convert to an **image sequence** (ffmpeg:
    `ffmpeg -i clip.mp4 -vf fps=30 frames/%04d.jpg`) and draw the current frame to a `<canvas>` based on
    scroll (Apple-style). Libraries: `gsap` + `ScrollTrigger`, or a small custom hook.
  - Overlay the product steps (the frosted panel, bottle PNGs, progress rail, scroll cue) absolutely-positioned,
    driven by the same scroll progress and the timeline above.
  - For the drip/mist/threats, composite lightweight HTML/canvas particle FX or short transparent video
    overlays per step.
- Pros: indistinguishable from real video. Cons: less interactive, asset weight (lazy-load frames,
  use AVIF/JPEG, ~150–300 frames).

### Route 2 — Pre-rendered 3D cinematic (photoreal + fully controlled)
Model the farm once in **Blender**, render an image sequence (Cycles), scrub on scroll (same as Route 1).
- Assets: Poly Haven (HDRIs + PBR ground/soil textures, free CC0), BlenderKit / Quaternius (plants),
  a grass/crop scatter (Blender particle/geometry nodes).
- Lighting: HDRI sky + sun; ACES view transform. Render the exact camera move from § A.
- Export 30fps sequence → scrub. Overlays as in Route 1.
- Pros: AAA visuals, deterministic, no runtime GPU cost. Cons: render time; re-render to change camera.

### Route 3 — Real-time 3D upgraded (interactive, near-AAA) ★ recommended if it must stay live
Rebuild the current scene in **React Three Fiber** with real assets + post-processing. The timeline/logic
in § A ports almost 1:1.
- Packages: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap` (ScrollTrigger) or drei `ScrollControls`.
- Realism upgrades over the prototype:
  - **Environment/lighting**: `<Environment files="farm_field.hdr" />` (Poly Haven HDRI) for image-based
    lighting + reflections; directional sun with soft shadows (`shadow-mapSize 2048`, PCSS via drei `softShadows()`).
  - **Ground**: PBR soil material (Poly Haven `aerial_grass_rock` / `brown_mud` — albedo/normal/roughness/AO),
    plus a tiled crop-row texture; consider displacement on a subdivided plane.
  - **Crops**: real GLTF crop/plant models (Sketchfab/Quaternius) instanced in rows
    (`<Instances>`/`InstancedMesh`); add an **instanced grass/wind shader** for the field
    (e.g. a grass shader pass, or `drei` `<Clouds>` + custom wind in the vertex shader).
  - **Hero plant**: a high-quality GLTF crop (e.g. tomato/pepper) with morph/scale to "grow" + fruit set.
  - **Water/drip**: instanced droplet meshes with a transmissive material (`MeshTransmissionMaterial` from drei)
    for refraction; small splash decals.
  - **Mist**: `drei` `<Cloud>`/volumetric sprites + a fine particle system; depth-fade against the plant.
  - **Nano particles**: additive `Points` converging (keep from prototype).
  - **Post-processing** (`@react-three/postprocessing`): `Bloom`, `SSAO`, `DepthOfField` (cinematic focus on
    the plant), `Vignette`, and a subtle `HueSaturation`/`BrightnessContrast` color grade for warm sunlight.
  - Tone mapping: ACES Filmic, exposure ~1.05–1.1, `sRGB` output (already in prototype).
- Keep all overlays/timeline from § A. Pros: interactive, responsive. Cons: needs asset sourcing + perf
  tuning (LODs, instancing, capped DPR).

### Recommendation
For "looks like a real video": **Route 1** (real footage) or **Route 2** (Blender pre-render) — both
scrub an image sequence and will read as genuine film. Choose **Route 3** only if the hero must remain a
live, interactive 3D scene. In all cases the **scroll timeline, step copy, overlays, and choreography in
§ A stay identical** — only the rendered "world" changes.

### Asset sources (free / licensable)
- HDRIs + PBR textures: **Poly Haven** (CC0).
- Plant/crop models: **Quaternius** (CC0), **Sketchfab** (filter CC), **BlenderKit**.
- Stock farm footage: **Pexels/Coverr** (free), **Artgrid/Filmsupply** (licensed).
- Grass/wind: drei examples, or "instanced grass three.js" shader references.
