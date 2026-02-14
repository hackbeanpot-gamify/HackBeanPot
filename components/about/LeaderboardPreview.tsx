"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const players = [
	{ rank: 1, name: "QueenCleanup", xp: 14_820, streak: 67, icon: "🐘" },
	{ rank: 2, name: "TrashSlayer99", xp: 12_340, streak: 42, icon: "🦁" },
	{ rank: 3, name: "GreenMachine", xp: 11_200, streak: 38, icon: "🐻" },
	{ rank: 4, name: "ParkRanger_J", xp: 9_870, streak: 29, icon: "🐒" },
	{ rank: 5, name: "VolunteerVic", xp: 8_450, streak: 21, icon: "🦝" },
];

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-yellow-400", "text-gray-400", "text-orange-400"];

export default function LeaderboardPreview() {
	return (
		<div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
			<div
				className="px-5 py-3 text-center font-extrabold text-white text-sm uppercase tracking-widest bg-pink-400"
				style={{ fontFamily: "var(--font-fredoka)" }}
			>
				🏆 City Leaderboard — This Week
			</div>

			<div className="divide-y divide-gray-50">
				{players.map((p, i) => {
					const RankIcon = rankIcons[i] ?? null;
					return (
						<motion.div
							key={p.rank}
							className="flex items-center gap-3 px-5 py-3 hover:bg-pink-50/40 transition-colors"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.15 * i, duration: 0.4 }}
						>
							<span className="w-7 text-center font-extrabold text-gray-800 text-lg">
								{RankIcon ? (
									<RankIcon
										className={`w-5 h-5 mx-auto ${rankColors[i]}`}
									/>
								) : (
									p.rank
								)}
							</span>
							<span className="text-2xl">{p.icon}</span>
							<div className="flex-1 min-w-0">
								<p
									className="font-bold text-gray-800 text-sm truncate"
									style={{ fontFamily: "var(--font-fredoka)" }}
								>
									{p.name}
								</p>
								<p className="text-xs text-orange-400">
									🔥 {p.streak}-day streak
								</p>
							</div>
							<span
								className="text-sm font-extrabold text-pink-500"
								style={{ fontFamily: "var(--font-fredoka)" }}
							>
								{p.xp.toLocaleString()} XP
							</span>
						</motion.div>
					);
				})}
			</div>

			<div className="px-5 py-2 text-center text-xs text-gray-400 font-medium bg-gray-50/50">
				Updated every 24 hours · Your rank: #847
			</div>
		</div>
	);
}
