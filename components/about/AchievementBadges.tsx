"use client";

import { motion } from "framer-motion";

/**
 * AchievementBadges — dark carnival badge grid.
 * Unlocked badges have warm amber ring, locked are dimmed.
 * Border uses warm amber tint (not cool slate).
 */
const badges = [
	{ emoji: "🌟", name: "First Quest", unlocked: true },
	{ emoji: "🔥", name: "7-Day Streak", unlocked: true },
	{ emoji: "🗑️", name: "Trash Titan", unlocked: true },
	{ emoji: "🌳", name: "Tree Hugger", unlocked: true },
	{ emoji: "🏆", name: "Top 10", unlocked: false },
	{ emoji: "⚔️", name: "Raid Boss", unlocked: false },
	{ emoji: "💎", name: "Diamond", unlocked: false },
	{ emoji: "👑", name: "Legendary", unlocked: false },
];

export default function AchievementBadges() {
	if (badges.length === 0) return null;

	return (
		<div className="bg-slate-800/50 border border-amber-400/15 rounded-xl p-4">
			<h3
				className="text-center font-bold text-slate-400 mb-3 text-[10px] uppercase tracking-wider"
				style={{ fontFamily: "var(--font-fredoka)" }}
			>
				🎖️ Achievement Badges
			</h3>
			<div className="grid grid-cols-4 gap-2">
				{badges.map((badge, i) => (
					<motion.div
						key={badge.name}
						className="flex flex-col items-center text-center gap-0.5"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: i * 0.05, type: "spring", stiffness: 350 }}
						whileHover={badge.unlocked ? { scale: 1.15, rotate: 5 } : undefined}
					>
						<div
							className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${
								badge.unlocked
									? "bg-amber-400/10 ring-2 ring-amber-400/40"
									: "bg-slate-700/30 grayscale opacity-25"
							}`}
						>
							{badge.emoji}
						</div>
						<span
							className={`text-[8px] font-bold leading-tight ${
								badge.unlocked ? "text-slate-300" : "text-slate-600"
							}`}
						>
							{badge.name}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	);
}
