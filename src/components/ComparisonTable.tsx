import { Check, X, Minus } from "lucide-react";

type Mark = "yes" | "no" | "partial";

function MarkCell({ mark }: { mark: Mark }) {
  if (mark === "yes")
    return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#E9F0E0] text-leaf-700"><Check size={17} strokeWidth={2.6} /></span>;
  if (mark === "partial")
    return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#FBEFD9] text-[#C97A06]"><Minus size={17} strokeWidth={2.6} /></span>;
  return <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#F1ECE6] text-[#B23A1E]"><X size={16} strokeWidth={2.6} /></span>;
}

const ROWS: { label: string; conv: Mark; org: Mark; ap: Mark }[] = [
  { label: "Builds resistance before pests & disease strike", conv: "no", org: "partial", ap: "yes" },
  { label: "All 6 crop functions in one program", conv: "no", org: "no", ap: "yes" },
  { label: "Custom-formulated to your crop & soil", conv: "no", org: "no", ap: "yes" },
  { label: "100% natural · no synthetic residue", conv: "no", org: "yes", ap: "yes" },
  { label: "Qualifies your crop for the organic premium", conv: "no", org: "yes", ap: "yes" },
  { label: "Treats the cause before problems appear", conv: "no", org: "partial", ap: "yes" },
  { label: "One supplier, one season-long program", conv: "no", org: "no", ap: "yes" },
  { label: "Runs through existing irrigation (fertigation)", conv: "partial", org: "partial", ap: "yes" },
  { label: "Rebuilds living soil season over season", conv: "no", org: "partial", ap: "yes" },
];

const apCol = "bg-[#F2F7EC]";

export default function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-panel border border-hair shadow-g-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hair bg-white">
              <th className="w-[40%] px-6 py-5"></th>
              <th className="px-5 py-5 text-center align-bottom">
                <div className="font-display text-[18px] font-extrabold text-ink">Conventional</div>
                <div className="mt-1 text-[12px] text-fg3">synthetic · reactive</div>
              </th>
              <th className="px-5 py-5 text-center align-bottom">
                <div className="font-display text-[18px] font-extrabold text-ink">Organic</div>
                <div className="mt-1 text-[12px] text-fg3">natural · many products</div>
              </th>
              <th className={`relative px-5 pb-5 pt-9 text-center align-bottom ${apCol}`}>
                <span className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-full bg-leaf px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">Best value</span>
                <div className="font-display text-[19px] font-extrabold text-forest">AgriPure</div>
                <div className="mt-1 text-[12px] text-fg3">natural · all-in-one · custom</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.label} className={i % 2 ? "bg-[#FCFBF7]" : "bg-white"}>
                <td className="px-6 py-3.5 text-[14.5px] font-medium text-[#3F463E]">{r.label}</td>
                <td className="px-5 py-3.5 text-center"><MarkCell mark={r.conv} /></td>
                <td className="px-5 py-3.5 text-center"><MarkCell mark={r.org} /></td>
                <td className={`px-5 py-3.5 text-center ${apCol}`}><MarkCell mark={r.ap} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
