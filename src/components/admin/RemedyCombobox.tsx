"use client";

import { useEffect, useMemo, useState } from "react";

const cell = "w-full rounded-lg border bg-white px-2.5 py-1.5 text-[13px] outline-none";

/** Single-select remedy picker constrained to the remedy library — free text cannot be committed. */
export default function RemedyCombobox({
  value, options, onChange, placeholder,
}: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hi, setHi] = useState(0);

  // Re-sync when the row's value changes externally (e.g. drag reorder) and we're not editing.
  useEffect(() => { if (!focused) setText(value); }, [value, focused]);

  const matches = useMemo(() => {
    const n = text.trim().toLowerCase();
    return (n ? options.filter((o) => o.toLowerCase().includes(n)) : options).slice(0, 8);
  }, [text, options]);

  const valid = !text.trim() || options.some((o) => o.toLowerCase() === text.trim().toLowerCase());

  const commit = (v: string) => { onChange(v); setText(v); setOpen(false); };

  const resolveOnBlur = () => {
    setFocused(false);
    const exact = options.find((o) => o.toLowerCase() === text.trim().toLowerCase());
    if (exact) commit(exact);
    else setText(value); // reject anything not in the library
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        className={`${cell} ${valid ? "border-[#D9D6C7] focus:border-leaf" : "border-[#E0A89A] focus:border-[#C0531C]"}`}
        value={text}
        placeholder={placeholder}
        onFocus={() => { setFocused(true); setOpen(true); }}
        onChange={(e) => { setText(e.target.value); setOpen(true); setHi(0); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(h + 1, matches.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); if (matches[hi]) commit(matches[hi]); }
          else if (e.key === "Escape") { setText(value); setOpen(false); (e.target as HTMLInputElement).blur(); }
        }}
        onBlur={() => setTimeout(resolveOnBlur, 120)}
      />
      {open && matches.length > 0 && (
        <div className="absolute z-40 mt-1 max-h-[220px] w-full overflow-y-auto rounded-lg border border-hair bg-white p-1 shadow-g-lg">
          {matches.map((o, i) => (
            <button key={o} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => commit(o)}
              className={`block w-full rounded px-2.5 py-1.5 text-left text-[13px] text-[#3F463E] hover:bg-[#FAF8F2] ${i === hi ? "bg-[#F0F5E9]" : ""}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
