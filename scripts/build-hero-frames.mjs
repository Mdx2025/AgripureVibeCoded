#!/usr/bin/env node
// Convert a Blender PNG render sequence into web hero frames + manifest.json.
//
//   npm i -D sharp
//   node scripts/build-hero-frames.mjs <inputDir> [--width 1600] [--ext avif] [--mobile 900]
//
// Example:
//   node scripts/build-hero-frames.mjs design-handoff/blender/render --width 1600 --ext avif --mobile 900
//
// Writes:  public/hero/frames/0001.avif … + public/hero/frames/manifest.json
//          public/hero/frames-mobile/0001.avif … (when --mobile is given)
//
// No sharp? Use the ffmpeg fallback in design-handoff/hero/README.md, then run
// this script with --manifest-only to just (re)generate manifest.json.

import { promises as fs } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : def;
};
const inputDir = args.find((a) => !a.startsWith("--") && args.indexOf(a) === 0);
const width = parseInt(opt("--width", "1600"), 10);
const ext = opt("--ext", "avif");
const mobileWidth = opt("--mobile", "") ? parseInt(opt("--mobile"), 10) : null;
const manifestOnly = args.includes("--manifest-only");
const pad = 4;

const outDir = path.resolve("public/hero/frames");
const outMobile = path.resolve("public/hero/frames-mobile");

const writeManifest = async (count) => {
  const manifest = { count, dir: "/hero/frames", ext, pad, ...(mobileWidth ? { mobileDir: "/hero/frames-mobile" } : {}) };
  await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`manifest.json → ${count} frames, ${ext}`);
};

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  if (manifestOnly) {
    const files = (await fs.readdir(outDir)).filter((f) => f.endsWith(`.${ext}`));
    return writeManifest(files.length);
  }

  if (!inputDir) {
    console.error("Usage: node scripts/build-hero-frames.mjs <inputDir> [--width N] [--ext avif] [--mobile N]");
    process.exit(1);
  }

  let sharp;
  try { sharp = (await import("sharp")).default; }
  catch { console.error("sharp not installed. Run `npm i -D sharp`, or use the ffmpeg fallback in the README."); process.exit(1); }

  const frames = (await fs.readdir(inputDir))
    .filter((f) => /\.(png|jpe?g|exr|tiff?)$/i.test(f))
    .sort();
  if (!frames.length) { console.error(`No image frames found in ${inputDir}`); process.exit(1); }

  if (mobileWidth) await fs.mkdir(outMobile, { recursive: true });

  let n = 0;
  for (const f of frames) {
    n++;
    const name = `${String(n).padStart(pad, "0")}.${ext}`;
    const src = path.join(inputDir, f);
    const pipe = (w, dir) => sharp(src).resize({ width: w }).toFormat(ext, { quality: 52 }).toFile(path.join(dir, name));
    await pipe(width, outDir);
    if (mobileWidth) await pipe(mobileWidth, outMobile);
    if (n % 20 === 0) console.log(`  …${n}/${frames.length}`);
  }
  await writeManifest(n);
  console.log(`Done → public/hero/frames/ (${n} frames). The hero will switch to scrub mode automatically.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
