"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

/**
 * LeaderboardPreview — dark carnival leaderboard.
 * Warm gold header, amber XP values, warm border.
 */
const players = [
	{ rank: 1, name: "QueenCleanup", xp: 14_820, streak: 67, icon: "🐘" },
	{ rank: 2, name: "TrashSlayer99", xp: 12_340, streak: 42, icon: "🦁" },
	{ rank: 3, name: "GreenMachine", xp: 11_200, streak: 38, icon: "🐻" },
	{ rank: 4, name: "ParkRanger_J", xp: 9_870, streak: 29, icon: "🐒" },
	{ rank: 5, name: "VolunteerVic", xp: 8_450, streak: 21, icon: "🦝" },
];

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-amber-400", "text-slate-400", "text-orange-400"];

export default function LeaderboardPreview() {
	if (players.length === 0) return null;

	return (
		<div className="bg-slate-800/50 border border-amber-400/15 rounded-xl overflow-hidden">
			<div
				className="px-4 py-2 text-center font-extrabold text-slate-900 text-[10px] uppercase tracking-widest bg-amber-400/80"
				style={{ fontFamily: "var(--font-fredoka)" }}
			>
				🏆 City Leaderboard — This Week
			</div>

			<div className="divide-y divide-slate-700/25">
				{players.map((p, i) => {
					const RankIcon = rankIcons[i] ?? null;
					return (
						<motion.div
							key={p.rank}
							className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/20 transition-colors"
							initial={{ opacity: 0, x: -12 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 * i, duration: 0.3 }}
						>
							<span className="w-5 text-center font-extrabold text-slate-400 text-sm">
								{RankIcon ? (
									<RankIcon
										className={`w-3.5 h-3.5 mx-auto ${rankColors[i]}`}
									/>
								) : (
									p.rank
								)}
							</span>
							<span className="text-lg">{p.icon}</span>
							<div className="flex-1 min-w-0">
								<p
									className="font-bold text-slate-200 text-xs truncate"
									style={{ fontFamily: "var(--font-fredoka)" }}
								>
									{p.name}
								</p>
								<p className="text-[9px] text-amber-400/40">
									🔥 {p.streak}-day streak
								</p>
							</div>
							<span
								className="text-[10px] font-extrabold text-amber-300"
								style={{ fontFamily: "var(--font-fredoka)" }}
							>
								{p.xp.toLocaleString()} XP
							</span>
						</motion.div>
					);
				})}
			</div>

			<div className="px-3 py-1.5 text-center text-[9px] text-slate-500 font-medium bg-slate-800/40">
				Updated every 24 hours · Your rank: #847
			</div>
		</div>
	);
}
