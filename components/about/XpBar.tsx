"use client";

import { motion } from "framer-motion";

/**
 * XpBar — carnival-styled XP progress bar for light background.
 * Warm gradient fill (amber → orange → red).
 * EMPTY DATA GUARD: returns null if no title or maxXp ≤ 0.
 */
interface XpBarProps {
  level?: number;
  currentXp?: number;
  maxXp?: number;
  title?: string;
}

export default function XpBar({
  level = 1,
  currentXp = 0,
  maxXp = 100,
  title = "",
}: XpBarProps) {
  if (!title || maxXp <= 0) return null;

  const pct = Math.min((currentXp / maxXp) * 100, 100);

  return (
    <div className="bg-slate-800/50 border border-amber-400/15 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p
          className="font-bold text-slate-200 text-xs"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          ⚡ Lv.{level} — {title}
        </p>
        <span
          className="text-[10px] font-extrabold text-amber-300"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-slate-700 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #f59e0b, #ff8a3d, #e84b5c)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
