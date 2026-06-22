# AgriPure Hero — Drone Footage Brief (commissioned shoot)

Hand this to a drone operator / DP, or use it to filter licensed stock. The web
side is already built — once you have the file, dropping it in is one step (bottom).

## The shot
A **Central Coast California coastal-ranch vineyard**, golden hour. Two usable forms:

**Option A — single cinematic clip (simplest, "loop" mode):**
- One continuous aerial: a slow drone **descent / push-in over rolling vineyard hills
  with the Pacific Ocean on the horizon**, settling toward the vine rows.
- Smooth, gimbal-stable, no hard cuts. It will gently loop behind the headline.
- 18–30 s is ideal.

**Option B — designed sequence cut to the 7 steps ("scrub" mode, most on-brief):**
- One continuous move that reads as: **fly in over the coast → descend to the rows →
  drift slowly along one block** — a steady forward journey with no cuts, so scroll can
  scrub it forward/back. ~24–40 s.
- We overlay the 7 treatment step cards on top (timed to scroll), so the footage itself
  just needs to be a beautiful continuous vineyard journey — it does NOT need to depict
  spraying/treatments.

## Technical specs
- **Resolution:** 4K (3840×2160) preferred; 1080p (1920×1080) minimum.
- **Aspect:** 16:9 landscape. (Optional: also a 9:16 vertical grade for mobile → `hero-mobile.mp4`.)
- **Frame rate:** 30 fps (24 also fine for loop; 30 preferred for scrub smoothness).
- **Codec/format:** **H.264 .mp4** (`yuv420p`), web-optimized with **faststart** (moov atom
  at front). Optionally also a **VP9 .webm** for smaller files. Keep the final under ~15–25 MB
  (compress; the hero streams on page load).
- **Color:** warm golden-hour grade; keep highlights from clipping (text sits over the sky area).
- **Composition:** leave the **center + lower third** relatively calm — the headline and the
  frosted step panel (left side) sit there. Strong interest toward the upper third / horizon
  (ocean) is great.
- **Audio:** none needed (it plays muted).

## Licensing
Make sure you have rights for **commercial web use**. Good sources: a commissioned shoot
(full rights), Artgrid / Filmsupply (licensed), or free-commercial libraries (Mixkit, Pexels,
Coverr) if a coastal-vineyard clip fits.

## Drop it in
1. Save the clip as `public/hero/hero.mp4` (replace the current stock placeholder).
   - Optional mobile cut: `public/hero/hero-mobile.mp4` (not yet auto-selected — ask to wire).
2. Choose how scroll behaves — create `public/hero/hero.json`:
   ```json
   { "mode": "scrub" }      // scroll drives the clip (Option B). Omit file = "loop" (Option A).
   ```
3. Reload. The hero switches to the new footage automatically (see ../hero/README.md for the
   driver order: footage → pre-rendered frames → WebGL fallback).

Tip for faststart with ffmpeg (if re-encoding a delivered file):
```
ffmpeg -i delivered.mov -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart -an public/hero/hero.mp4
```
