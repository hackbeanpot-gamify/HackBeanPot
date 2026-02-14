import type { LucideIcon } from "lucide-react";

/**
 * StepCard — "How It Works" step card, carnival style.
 *
 * Number sits in a warm-colored circle (the card's accent).
 * Dark panel with warm border. Icon in muted slate.
 * Compact vertical layout for 2×2 grid display.
 *
 * COLORS: Each step has its own warm carnival color prop
 * (bg-amber-400, bg-orange-400, bg-red-400, bg-yellow-400).
 *
 * EMPTY DATA GUARD: returns null if title or desc is empty.
 */
interface StepCardProps {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  showConnector?: boolean;
}

export default function StepCard({
  num,
  title,
  desc,
  icon: Icon,
  color,
}: StepCardProps) {
  if (!title || !desc) return null;

  return (
    <div className="relative text-center transition-transform duration-300 hover:-translate-y-1">
      {/* Number badge — warm carnival accent color */}
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${color} text-slate-900 text-sm font-extrabold shadow-md mb-2 ring-2 ring-slate-800`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {num}
      </div>
      {/* Card body — dark with warm border accent */}
      <div className={`rounded-lg p-3 border border-slate-700/30 bg-slate-800/50`}>
        <Icon className="w-3.5 h-3.5 mx-auto text-slate-500 mb-1" />
        <h3
          className="font-bold text-slate-200 text-xs"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {title}
        </h3>
        <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
