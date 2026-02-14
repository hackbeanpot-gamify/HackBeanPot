"use client";

import { motion } from "framer-motion";

/**
 * CrewBadge — overlapping avatar circles with quest count.
 * All circles are the same size and perfectly centered on a single row.
 */
interface CrewBadgeProps {
  questCount?: number;
}

const avatars = ["👩‍🦰", "👨‍🦱", "👩🏽", "👨🏿", "👱"];

export default function CrewBadge({ questCount }: CrewBadgeProps) {
  return (
    <div className="inline-flex flex-col items-center gap-3 bg-slate-800/60 border border-amber-400/15 rounded-2xl px-6 py-4">
      {/* Avatar row — each circle is 10x10, offset by -ml-2 for overlap */}
      <div className="flex items-center justify-center">
        {avatars.map((emoji, i) => (
          <motion.div
            key={i}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-slate-700/80 border-2 border-slate-600/50"
            style={{
              marginLeft: i === 0 ? 0 : "-0.5rem",
              zIndex: avatars.length - i,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
          >
            {emoji}
          </motion.div>
        ))}
        {/* +count pill */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-slate-400 bg-slate-700/50 border-2 border-slate-600/30"
          style={{ marginLeft: "-0.5rem", zIndex: 0 }}
        >
          +4.2k
        </div>
      </div>

      {/* Quest count label */}
      {questCount != null && questCount > 0 && (
        <p className="text-sm text-slate-400">
          <span className="font-bold text-amber-400">
            {questCount.toLocaleString()}
          </span>{" "}
          quests completed together
        </p>
      )}
    </div>
  );
}
