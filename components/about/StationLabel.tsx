
"use client";

interface StationLabelProps {
  label: string;
  number?: number;
  variant?: "pink" | "yellow" | "blue" | "mint" | "peach";
}

const variants = {
  pink: "bg-pink-100 text-pink-700 border-pink-300",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
  blue: "bg-sky-100 text-sky-700 border-sky-300",
  mint: "bg-emerald-100 text-emerald-700 border-emerald-300",
  peach: "bg-orange-100 text-orange-700 border-orange-300",
};

export default function StationLabel({
  label,
  number,
  variant = "pink",
}: StationLabelProps) {
  return (
    <div className="flex justify-center mb-6">
      <div
        className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full border-2 border-dashed text-xs font-extrabold uppercase tracking-[0.15em] ${variants[variant]}`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {number !== undefined && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-current/10 text-[10px]">
            {number}
          </span>
        )}
        🎢 {label}
      </div>
    </div>
  );
}
