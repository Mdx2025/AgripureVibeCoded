# Photoreal 3D Hero — pre-rendered scrub pipeline

The hero is a **scroll-scrubbed image sequence**: render the 7-step
**Central Coast California coastal-ranch vineyard** once (photoreal) — golden
rolling hills, scattered live oaks, the Pacific on the horizon — export ~240
frames, and the site draws the frame matching scroll position. The web side is
**already built and live** — it just needs the frames.

## How activation works
`src/components/experience/Experience3D.tsx` fetches `/hero/frames/manifest.json`
on load:
- **manifest present** → uses the pre-rendered scrubber (`scrubber.ts`) — photoreal.
- **manifest absent** → falls back to the live real-time WebGL vineyard (`scene.ts`).

So nothing breaks today; the moment you drop frames + manifest into
`public/hero/frames/`, the hero switches to the film render automatically. Both
modes are driven by the same `src/lib/hero-timeline.ts`, so the on-page step
panel / 01–07 rail / scroll cue stay perfectly in sync with the footage.

## Produce the frames (Blender — recommended)
1. Build the scene scaffold:
   ```
   blender -b -P design-handoff/blender/agripure_vineyard.py --save-as hero.blend
   ```
   This sets up Cycles + AgX + 30fps/240 frames + a 16:9 crop, the **exact camera
   move** (keyframed from the site's timeline), step markers, and a `Control`
   empty with `health / app / clear / flowers / fruit` properties keyframed per step.
2. Make it photoreal (artist work — TODO markers in the script):
   - World **HDRI** — a **coastal golden-hour** sky — + sun strength ([Poly Haven](https://polyhaven.com), CC0).
   - **Rolling hills** (`make_hills`) — sculpt/scatter real terrain + dry golden-grass material.
   - **Ocean** (`make_ocean`) — the Pacific to −Z; add wave normal/displacement + a little foam.
   - **PBR soil** ground + tiled crop-row texture; geometry-nodes vine-row scatter; live oaks.
   - A real **grapevine GLTF** with shape keys for growth + grape clusters; drive
     them off the `Control` empty (Drivers → `health`, `flowers`, `fruit`).
   - Particle systems for **drip / mist**; threat objects fading via `clear`.
3. `Render → Render Animation` → PNGs in `design-handoff/blender/render/`.

*(Alternative: license a continuous drone-into-vineyard + macro clip and extract
frames with `ffmpeg -i clip.mp4 -vf fps=30 render/%04d.png`, then continue below.
Real footage can't show the threat-clearing / fruit-set beats — keep those as the
existing HTML/canvas overlays.)*

## Encode to web frames + manifest
**With sharp (recommended, cross-platform):**
```
npm i -D sharp
node scripts/build-hero-frames.mjs design-handoff/blender/render --width 1600 --ext avif --mobile 900
```
Writes `public/hero/frames/0001.avif …` + `manifest.json`, plus a downscaled
`public/hero/frames-mobile/` set. Done — reload the site.

**ffmpeg fallback (per-frame AVIF via libavif `avifenc`):**
```
mkdir -p public/hero/frames
i=1; for f in design-handoff/blender/render/*.png; do
  n=$(printf "%04d" $i); avifenc --min 24 --max 32 "$f" "public/hero/frames/$n.avif"; i=$((i+1));
done
node scripts/build-hero-frames.mjs --manifest-only --ext avif
```

## Notes / budget
- ~240 AVIF frames @1600px ≈ **6–10 MB** total; the scrubber preloads frame 0
  first (instant paint), then streams the rest with bounded concurrency.
- Drop `--mobile` to skip the mobile set; the scrubber cover-fits either way.
- `prefers-reduced-motion` shows step 1 statically (handled in `Experience3D.tsx`).
- Frame count is flexible — set `count` in the manifest to whatever you render
  (keep `frame_end` in the Blender script in sync if you change it).
