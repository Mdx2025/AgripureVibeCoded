"use client";

import { useMemo, useState } from "react";
import { Check, Globe, Search, AlertTriangle } from "lucide-react";
import { SEO_PAGES, PRODUCT_TEMPLATE_PATH, type SeoConfig, type SeoEntry } from "@/lib/seo";

const field =
  "w-full rounded-[10px] border border-[#D9D6C7] bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-leaf";
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.06em] text-fg3";

const TITLE_MAX = 60;
const DESC_MAX = 160;

function Counter({ value, max }: { value: number; max: number }) {
  const over = value > max;
  return (
    <span className={`font-mono text-[11px] ${over ? "text-[#B23A1E]" : value > max * 0.85 ? "text-[#C97A06]" : "text-fg3"}`}>
      {value}/{max}
    </span>
  );
}

/** Google-style search result preview. */
function SerpPreview({ baseUrl, path, title, description }: { baseUrl: string; path: string; title: string; description: string }) {
  const host = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const crumb = path === "/" ? host : `${host} › ${path.split("/").filter(Boolean).join(" › ")}`;
  return (
    <div className="rounded-[12px] border border-hair bg-[#FBFBF9] p-4">
      <div className="mb-1 flex items-center gap-1.5 text-[12px] text-[#4d5156]">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E9F0E0] text-[#356A26]"><Globe size={11} /></span>
        <span className="truncate">{crumb}</span>
      </div>
      <div className="truncate text-[18px] leading-tight text-[#1a0dab]">{title || "Untitled page"}</div>
      <div className="mt-1 line-clamp-2 text-[13px] leading-[1.5] text-[#4d5156]">
        {description || "No meta description set."}
      </div>
    </div>
  );
}

export default function SeoManager({ initial }: { initial: SeoConfig }) {
  const [config, setConfig] = useState<SeoConfig>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const setSite = (patch: Partial<SeoConfig["site"]>) =>
    setConfig((c) => ({ ...c, site: { ...c.site, ...patch }, pages: c.pages }));

  const setPage = (path: string, patch: Partial<SeoEntry>) =>
    setConfig((c) => ({ ...c, pages: { ...c.pages, [path]: { ...c.pages[path], ...patch } } }));

  const save = async () => {
    setStatus("saving");
    setError("");
    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      const { config: saved } = await res.json();
      setConfig(saved);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setError((await res.json().catch(() => ({}))).error ?? "Save failed");
    }
  };

  const groups = useMemo(() => {
    const out: Record<string, typeof SEO_PAGES> = {};
    for (const p of SEO_PAGES) (out[p.group] ??= []).push(p);
    return out;
  }, []);

  return (
    <div className="max-w-[1000px] pb-16">
      {/* header / save */}
      <div className="sticky top-[72px] z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-hair bg-paper/90 px-4 py-3 backdrop-blur-[8px] sm:-mx-[30px] sm:px-[30px]">
        <p className="max-w-[560px] text-sm text-[#7A8076]">
          Control the title, description, and social preview each page shows in Google and when shared. Changes go
          live the moment you save.
        </p>
        <div className="flex items-center gap-3">
          {status === "ok" && <span className="flex items-center gap-1 text-[13px] font-semibold text-leaf-700"><Check size={15} /> Saved</span>}
          {status === "error" && <span className="flex items-center gap-1 text-[13px] font-semibold text-[#B23A1E]"><AlertTriangle size={14} /> {error}</span>}
          <button onClick={save} disabled={status === "saving"} className="btn-primary px-6 py-2.5 text-sm">
            {status === "saving" ? "Saving…" : "Save SEO"}
          </button>
        </div>
      </div>

      {/* site-wide settings */}
      <section className="mb-6 rounded-panel border border-hair bg-white p-6">
        <div className="mb-1 font-display text-[18px] font-extrabold text-forest">Site-wide settings</div>
        <p className="mb-4 text-[13px] text-fg3">Used to build canonical URLs, social cards, and the default share image for every page.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>Site name
            <input className={`${field} mt-1.5 normal-case`} value={config.site.siteName} onChange={(e) => setSite({ siteName: e.target.value })} />
          </label>
          <label className={labelCls}>Base URL
            <input className={`${field} mt-1.5 font-mono normal-case`} value={config.site.baseUrl} onChange={(e) => setSite({ baseUrl: e.target.value })} placeholder="https://agripure.com" />
          </label>
          <label className={labelCls}>Default social image (OG)
            <input className={`${field} mt-1.5 normal-case`} value={config.site.defaultOgImage} onChange={(e) => setSite({ defaultOgImage: e.target.value })} placeholder="/assets/og.jpg or full URL" />
          </label>
          <label className={labelCls}>Twitter / X handle
            <input className={`${field} mt-1.5 normal-case`} value={config.site.twitter} onChange={(e) => setSite({ twitter: e.target.value })} placeholder="@agripure" />
          </label>
        </div>
      </section>

      {/* per-page */}
      {Object.entries(groups).map(([group, pages]) => (
        <div key={group} className="mb-2">
          <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[0.12em] text-fg3">{group}</div>
          <div className="flex flex-col gap-5">
            {pages.map(({ path, label, note }) => {
              const entry = config.pages[path] ?? { title: "", description: "" };
              const isTemplate = path === PRODUCT_TEMPLATE_PATH;
              return (
                <section key={path} className="rounded-panel border border-hair bg-white p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-display text-[17px] font-extrabold text-forest">{label}</div>
                      <div className="font-mono text-[12px] text-fg3">{path}{isTemplate ? "/…" : ""}</div>
                    </div>
                    <label className="flex items-center gap-2 text-[13px] font-semibold text-fg2">
                      <input type="checkbox" checked={!!entry.noindex} onChange={(e) => setPage(path, { noindex: e.target.checked })} />
                      Hide from search (noindex)
                    </label>
                  </div>

                  {note && (
                    <p className="mb-4 rounded-lg bg-[#F4F0E2] px-3 py-2 text-[12.5px] text-[#6b6448]">{note}</p>
                  )}

                  <div className="grid gap-5 lg:grid-cols-2">
                    {/* editable fields */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>Meta title</span>
                          <Counter value={entry.title?.length ?? 0} max={TITLE_MAX} />
                        </div>
                        <input className={`${field} mt-1.5 normal-case`} value={entry.title ?? ""} onChange={(e) => setPage(path, { title: e.target.value })} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>Meta description</span>
                          <Counter value={entry.description?.length ?? 0} max={DESC_MAX} />
                        </div>
                        <textarea rows={3} className={`${field} mt-1.5 resize-y normal-case`} value={entry.description ?? ""} onChange={(e) => setPage(path, { description: e.target.value })} />
                      </div>
                      <label className={labelCls}>Keywords <span className="font-normal normal-case text-fg3">(comma-separated)</span>
                        <input className={`${field} mt-1.5 normal-case`} value={entry.keywords ?? ""} onChange={(e) => setPage(path, { keywords: e.target.value })} />
                      </label>
                      <label className={labelCls}>Social image override <span className="font-normal normal-case text-fg3">(optional)</span>
                        <input className={`${field} mt-1.5 normal-case`} value={entry.ogImage ?? ""} onChange={(e) => setPage(path, { ogImage: e.target.value })} placeholder="Defaults to site image" />
                      </label>
                    </div>

                    {/* preview */}
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-fg3">
                        <Search size={12} /> Search preview
                      </div>
                      <SerpPreview baseUrl={config.site.baseUrl} path={path} title={entry.title ?? ""} description={entry.description ?? ""} />
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
