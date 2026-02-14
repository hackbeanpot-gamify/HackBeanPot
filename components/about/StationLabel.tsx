"use client";

/**
 * StationLabel — a small carnival-style signage pill used as a
 * section label on mobile (on desktop, the TrackSection dot serves
 * this purpose). Kept as a reusable marker.
 */
interface StationLabelProps {
  label: string;
  variant?: "pink" | "yellow" | "blue" | "mint" | "peach";
}

const variants = {
  pink: "bg-pink-50 text-pink-500 border-pink-200",
  yellow: "bg-amber-50 text-amber-600 border-amber-200",
  blue: "bg-sky-50 text-sky-500 border-sky-200",
  mint: "bg-emerald-50 text-emerald-500 border-emerald-200",
  peach: "bg-orange-50 text-orange-500 border-orange-200",
};

export default function StationLabel({
  label,
  variant = "pink",
}: StationLabelProps) {
  return (
    <div className="flex justify-center mb-5">
      <div
        className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full border border-dashed text-[11px] font-bold uppercase tracking-[0.12em] ${variants[variant]}`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {label}
      </div>
    </div>
  );
}
