"use client";

import { useState, useRef, useId } from "react";
import { X, Plus, Search, Check } from "lucide-react";

export default function MultiCombobox({
  value,
  onChange,
  options,
  placeholder = "Type to search…",
  allowCustom = true,
  noneLabel,
  unsureLabel,
  size = "md",
  maxOptions = 8,
  listMaxH = "max-h-[240px]",
  quickPicks = [],
  quickPickLabel,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
  noneLabel?: string;
  /** a second exclusive option (e.g. "I don't know") shown next to noneLabel */
  unsureLabel?: string;
  size?: "md" | "lg";
  /** how many matching options to render in the dropdown (default 8) */
  maxOptions?: number;
  /** Tailwind max-height class for the scrollable dropdown */
  listMaxH?: string;
  /** the most common items, surfaced up front as one-tap toggle chips */
  quickPicks?: string[];
  /** small caption shown above the quick-pick chips */
  quickPickLabel?: string;
}) {
  const lg = size === "lg";
  const sz = {
    chip: lg ? "px-4 py-2 text-[15px]" : "px-3 py-1.5 text-[13px]",
    box: lg ? "px-4 py-4" : "px-3.5 py-2.5",
    input: lg ? "text-[18px]" : "text-[15px]",
    icon: lg ? 20 : 16,
    opt: lg ? "px-3.5 py-3 text-[16px]" : "px-3 py-2 text-[14px]",
    none: lg ? "px-4 py-2 text-[15px]" : "px-3.5 py-1.5 text-[13px]",
    pick: lg ? "px-4 py-2 text-[15px]" : "px-3.5 py-1.5 text-[13px]",
  };
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const q = query.trim();
  const selectedSet = new Set(value.map((v) => v.toLowerCase()));
  const filtered = options
    .filter((o) => !selectedSet.has(o.toLowerCase()) && o.toLowerCase().includes(q.toLowerCase()))
    .slice(0, maxOptions);
  const exact = options.some((o) => o.toLowerCase() === q.toLowerCase()) || selectedSet.has(q.toLowerCase());
  const showAdd = allowCustom && q.length > 0 && !exact;

  // "No known problems" and "I don't know" are mutually-exclusive answers: each
  // clears the rest, and picking a real item clears them.
  const exclusive = [noneLabel, unsureLabel].filter(Boolean) as string[];
  const isExclusive = (v: string) => exclusive.includes(v);
  const noneSelected = !!noneLabel && value.includes(noneLabel);
  const unsureSelected = !!unsureLabel && value.includes(unsureLabel);
  const locked = noneSelected || unsureSelected;

  const add = (item: string) => {
    if (isExclusive(item)) { onChange([item]); setQuery(""); return; }
    const next = value.filter((v) => !isExclusive(v));
    if (!next.some((v) => v.toLowerCase() === item.toLowerCase())) next.push(item);
    onChange(next);
    setQuery("");
  };
  const remove = (item: string) => onChange(value.filter((v) => v.toLowerCase() !== item.toLowerCase()));

  // The "most common" quick-pick chips show their own selected state, so keep
  // them out of the removable selected-chips row (which then only carries the
  // extras a farmer searched for or typed in). The "no known problems" option
  // has its own button below, so it never appears as a chip either.
  const quickSet = new Set(quickPicks.map((s) => s.toLowerCase()));
  const extras = value.filter((v) => !isExclusive(v) && !quickSet.has(v.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      {/* most-common-for-this-crop quick picks — tap to toggle */}
      {quickPicks.length > 0 && (
        <div className="mb-3.5">
          <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.05em] text-fg3">
            {quickPickLabel ?? "Most common — tap to select"}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPicks.map((item) => {
              const on = selectedSet.has(item.toLowerCase());
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => (on ? remove(item) : add(item))}
                  className={`inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors ${sz.pick} ${
                    on
                      ? "border-leaf-600 bg-leaf-600 text-white"
                      : "border-hair-strong bg-white text-fg2 hover:border-leaf hover:text-forest"
                  }`}
                >
                  {on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} strokeWidth={2.4} />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* selected extras (searched / custom) */}
      {extras.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {extras.map((v) => (
            <span
              key={v}
              className={`inline-flex items-center gap-1.5 rounded-full bg-[#E9F0E0] font-semibold text-leaf-700 ${sz.chip}`}
            >
              {v}
              <button onClick={() => remove(v)} className="opacity-60 hover:opacity-100" aria-label={`Remove ${v}`}>
                <X size={13} strokeWidth={2.4} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className={`flex items-center gap-2 rounded-[12px] border border-hair bg-white focus-within:border-leaf ${sz.box}`}>
        <Search size={sz.icon} className="text-fg3" />
        <input
          id={id}
          value={query}
          disabled={locked}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length) add(filtered[0]);
              else if (showAdd) add(q);
            }
          }}
          placeholder={locked ? "Clear the option below to add items" : placeholder}
          className={`w-full bg-transparent outline-none disabled:cursor-not-allowed ${sz.input}`}
        />
      </div>

      {open && !locked && (filtered.length > 0 || showAdd) && (
        <div className={`absolute z-30 mt-1.5 w-full overflow-y-auto rounded-[12px] border border-hair bg-white p-1.5 shadow-g-lg ${listMaxH}`}>
          {filtered.map((o) => (
            <button
              key={o}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(o)}
              className={`block w-full rounded-lg text-left text-[#3F463E] hover:bg-[#FAF8F2] ${sz.opt}`}
            >
              {o}
            </button>
          ))}
          {showAdd && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(q)}
              className={`flex w-full items-center gap-2 rounded-lg text-left font-semibold text-leaf-700 hover:bg-[#FAF8F2] ${sz.opt}`}
            >
              <Plus size={15} strokeWidth={2.4} /> Add &ldquo;{q}&rdquo;
            </button>
          )}
        </div>
      )}

      {(noneLabel || unsureLabel) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {noneLabel && (
            <button
              onClick={() => (noneSelected ? onChange([]) : add(noneLabel))}
              className={`inline-flex items-center gap-2 rounded-full border font-semibold transition-colors ${sz.none} ${
                noneSelected ? "border-forest bg-forest text-white" : "border-hair-strong bg-white text-fg2 hover:border-forest"
              }`}
            >
              {noneSelected && <Check size={14} strokeWidth={2.6} />}
              {noneLabel}
            </button>
          )}
          {unsureLabel && (
            <button
              onClick={() => (unsureSelected ? onChange([]) : add(unsureLabel))}
              className={`inline-flex items-center gap-2 rounded-full border font-semibold transition-colors ${sz.none} ${
                unsureSelected ? "border-forest bg-forest text-white" : "border-hair-strong bg-white text-fg2 hover:border-forest"
              }`}
            >
              {unsureSelected && <Check size={14} strokeWidth={2.6} />}
              {unsureLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
