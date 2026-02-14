"use client";

import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";

/**
 * StreakCounter — dark carnival streak display.
 * Animated flame, amber check dots, warm accents.
 */
const days = ["M", "T", "W", "T", "F", "S", "S"];
const completed = [true, true, true, true, true, true, false];

interface StreakCounterProps {
  streakDays?: number;
}

export default function StreakCounter({ streakDays = 42 }: StreakCounterProps) {
  if (streakDays <= 0) return null;

  return (
    <div className="bg-slate-800/50 border border-amber-400/15 rounded-xl p-3">
      <div className="flex items-center justify-center gap-2 mb-2.5">
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Flame className="w-6 h-6 text-amber-400 fill-amber-500/50" />
        </motion.div>
        <span
          className="text-2xl font-extrabold text-slate-100"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {streakDays}
        </span>
        <span className="text-[9px] font-bold text-amber-400/50 uppercase tracking-wide leading-tight">
          day
          <br />
          streak
        </span>
      </div>

      <div className="flex justify-center gap-1">
        {days.map((day, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-0.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                completed[i]
                  ? "bg-amber-400/70 text-slate-900"
                  : "bg-slate-700/40 text-slate-500 border border-dashed border-slate-600/50"
              }`}
            >
              {completed[i] ? <Check className="w-3 h-3" /> : "?"}
            </div>
            <span className="text-[8px] font-semibold text-slate-500">
              {day}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mt-1.5 text-center text-[9px] text-slate-500 font-medium">
        Complete today&apos;s quest to keep your streak alive!
      </p>
    </div>
  );
}
