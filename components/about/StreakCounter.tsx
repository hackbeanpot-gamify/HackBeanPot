"use client";

import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const completed = [true, true, true, true, true, true, false];

interface StreakCounterProps {
  streakDays?: number;
}

export default function StreakCounter({ streakDays = 42 }: StreakCounterProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {/* streak count */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Flame className="w-8 h-8 text-orange-400 fill-yellow-300" />
        </motion.div>
        <span
          className="text-4xl font-extrabold text-gray-800"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {streakDays}
        </span>
        <span className="text-sm font-bold text-orange-400 uppercase tracking-wide leading-tight">
          day<br />streak
        </span>
      </div>

      {/* weekly progress */}
      <div className="flex justify-center gap-2">
        {days.map((day, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                completed[i]
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200"
              }`}
            >
              {completed[i] ? <Check className="w-4 h-4" /> : "?"}
            </div>
            <span className="text-[10px] font-semibold text-gray-400">{day}</span>
          </motion.div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-gray-400 font-medium">
        Complete today&apos;s quest to keep your streak alive!
      </p>
    </div>
  );
}
