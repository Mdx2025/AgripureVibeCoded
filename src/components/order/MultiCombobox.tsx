"use client";

import { useState, useRef, useId } from "react";
import { X, Plus, Search } from "lucide-react";

export default function MultiCombobox({
  value,
  onChange,
  options,
  placeholder = "Type to search…",
  allowCustom = true,
  noneLabel,
  size = "md",
  maxOptions = 8,
  listMaxH = "max-h-[240px]",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
  noneLabel?: string;
  size?: "md" | "lg";
  /** how many matching options to render in the dropdown (default 8) */
  maxOptions?: number;
  /** Tailwind max-height class for the scrollable dropdown */
  listMaxH?: string;
}) {
  const lg = size === "lg";
  const sz = {
    chip: lg ? "px-4 py-2 text-[15px]" : "px-3 py-1.5 text-[13px]",
    box: lg ? "px-4 py-4" : "px-3.5 py-2.5",
    input: lg ? "text-[18px]" : "text-[15px]",
    icon: lg ? 20 : 16,
    opt: lg ? "px-3.5 py-3 text-[16px]" : "px-3 py-2 text-[14px]",
    none: lg ? "px-4 py-2 text-[15px]" : "px-3.5 py-1.5 text-[13px]",
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

  const noneSelected = !!noneLabel && value.includes(noneLabel);

  const add = (item: string) => {
    if (noneLabel && item === noneLabel) { onChange([noneLabel]); setQuery(""); return; }
    const next = value.filter((v) => v !== noneLabel);
    if (!next.some((v) => v.toLowerCase() === item.toLowerCase())) next.push(item);
    onChange(next);
    setQuery("");
  };
  const remove = (item: string) => onChange(value.filter((v) => v !== item));

  return (
    <div ref={ref} className="relative">
      {/* selected chips */}
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((v) => (
            <span
              key={v}
              className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sz.chip} ${
                v === noneLabel ? "bg-[#F0EDE3] text-fg2" : "bg-[#E9F0E0] text-leaf-700"
              }`}
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
          disabled={noneSelected}
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
          placeholder={noneSelected ? "Clear the option below to add items" : placeholder}
          className={`w-full bg-transparent outline-none disabled:cursor-not-allowed ${sz.input}`}
        />
      </div>

      {open && !noneSelected && (filtered.length > 0 || showAdd) && (
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

      {noneLabel && (
        <button
          onClick={() => (noneSelected ? onChange([]) : add(noneLabel))}
          className={`mt-2.5 inline-flex items-center gap-2 rounded-full border font-semibold transition-colors ${sz.none} ${
            noneSelected ? "border-forest bg-forest text-white" : "border-hair-strong bg-white text-fg2 hover:border-forest"
          }`}
        >
          {noneLabel}
        </button>
      )}
    </div>
  );
}
