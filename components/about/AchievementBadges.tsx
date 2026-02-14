"use client";

import { motion } from "framer-motion";

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
	return (
		<div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
			<h3
				className="text-center font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide"
				style={{ fontFamily: "var(--font-fredoka)" }}
			>
				🎖️ Achievement Badges
			</h3>
			<div className="grid grid-cols-4 gap-3">
				{badges.map((badge, i) => (
					<motion.div
						key={badge.name}
						className="flex flex-col items-center text-center gap-1"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
						whileHover={badge.unlocked ? { scale: 1.15, rotate: 5 } : undefined}
					>
						<div
							className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
								badge.unlocked
									? "bg-yellow-50 ring-2 ring-yellow-300 shadow-sm"
									: "bg-gray-100 grayscale opacity-35"
							}`}
						>
							{badge.emoji}
						</div>
						<span
							className={`text-[10px] font-bold leading-tight ${
								badge.unlocked ? "text-gray-700" : "text-gray-400"
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
