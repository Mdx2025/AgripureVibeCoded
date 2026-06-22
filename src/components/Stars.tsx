import { Star } from "lucide-react";

export default function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={1.5}
          className="text-[#E0A92E]"
          fill={i < full ? "#E0A92E" : "none"}
        />
      ))}
    </span>
  );
}
