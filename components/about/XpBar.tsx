"use client";

import { motion } from "framer-motion";

interface XpBarProps {
  level: number;
  currentXp: number;
  maxXp: number;
  title: string;
}

export default function XpBar({ level, currentXp, maxXp, title }: XpBarProps) {
  const pct = Math.min((currentXp / maxXp) * 100, 100);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-400 text-white text-sm font-extrabold ring-2 ring-yellow-300"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {level}
          </span>
          <span
            className="font-bold text-gray-800 text-sm"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {title}
          </span>
        </div>
        <span className="text-xs font-semibold text-pink-500">
          {currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP
        </span>
      </div>
      <div className="h-4 rounded-full bg-pink-100 overflow-hidden relative">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #F9A8D4, #FBBF24, #34D399)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
