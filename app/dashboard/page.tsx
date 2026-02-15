/**
 * app/dashboard/page.tsx
 *
 * Carnival-themed dashboard with 4 tent carousel:
 *   Profile | Leaderboard | Quests | Boss Quests
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { useQuests } from "@/lib/hooks/useQuests";
import { useAssignedQuests } from "@/lib/hooks/useAssignedQuests";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import type { LeaderboardEntry } from "@/types";
import ArcadeNavbar from "@/components/ArcadeNavbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] });
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

interface DashboardQuest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  xp_reward?: number;
  xpReward?: number;
  estimated_minutes?: number;
  difficulty?: string;
  is_daily?: boolean;
  active?: boolean;
}

interface TentProps {
  color: string;
  lightColor: string;
  darkColor: string;
  glowColor: string;
  title: string;
  children: React.ReactNode;
}

interface TentColorSet {
  color: string;
  lightColor: string;
  darkColor: string;
  glowColor: string;
}

const TENT_COLORS: TentColorSet[] = [
  { color: "#e84b5c", lightColor: "#f47182", darkColor: "#b83a4a", glowColor: "rgba(232,75,92,0.2)" },
  { color: "#f6c453", lightColor: "#fad97a", darkColor: "#c99a2e", glowColor: "rgba(246,196,83,0.2)" },
  { color: "#3b82f6", lightColor: "#60a5fa", darkColor: "#2563eb", glowColor: "rgba(59,130,246,0.2)" },
  { color: "#22c55e", lightColor: "#4ade80", darkColor: "#16a34a", glowColor: "rgba(34,197,94,0.25)" },
];

const TENT_DATA = [
  { name: "Profile", icon: "👤" },
  { name: "Leaderboard", icon: "🏆" },
  { name: "Quests", icon: "🎯" },
  { name: "Boss Quests", icon: "🐉" },
];

const TOTAL_TENTS = 4;

/* ── Arrow Button ── */
function ArcadeArrow({ direction, onClick, color }: { direction: "left" | "right"; onClick: () => void; color: string }): React.JSX.Element {
  return (
    <button onClick={onClick} className="group relative shrink-0" aria-label={`${direction === "left" ? "Previous" : "Next"} tent`}>
      <div className="w-18 h-18 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
        style={{ background: `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`, border: `3px solid ${color}`, boxShadow: `0 0 25px ${color}50, inset 0 2px 0 rgba(255,255,255,0.15)` }}>
        {direction === "left" ? <ChevronLeft className="w-9 h-9 md:w-10 md:h-10" style={{ color }} /> : <ChevronRight className="w-9 h-9 md:w-10 md:h-10" style={{ color }} />}
      </div>
    </button>
  );
}

/* ── Tent ── */
function Tent({ color, lightColor, darkColor, glowColor, title, children }: TentProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center w-full max-w-[680px] mx-auto" style={{ filter: `drop-shadow(0 10px 40px ${glowColor})` }}>
      <div className="relative z-10 -mb-10">
        <div style={{ width: 8, height: 80, backgroundColor: darkColor, margin: "0 auto" }} />
        <div style={{ width: 48, height: 36, backgroundColor: color, clipPath: "polygon(0 0, 100% 30%, 0 100%)", position: "absolute", top: 2, left: 10, filter: `drop-shadow(0 4px 10px ${glowColor})` }} />
      </div>
      <div className="w-full relative" style={{ height: 216 }}>
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)", background: `linear-gradient(135deg, ${lightColor} 0%, ${color} 40%, ${darkColor} 100%)` }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 58% 100%, 42% 100%)", backgroundColor: darkColor, opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 30% 100%, 18% 100%)", backgroundColor: darkColor, opacity: 0.3 }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 82% 100%, 70% 100%)", backgroundColor: darkColor, opacity: 0.3 }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 55% 100%, 45% 100%)", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
          <svg viewBox="0 0 320 25" className="w-full" preserveAspectRatio="none">
            {Array.from({ length: 16 }, (_, i) => (<ellipse key={i} cx={10 + i * 20} cy="8" rx="11" ry="10" fill={color} opacity="0.85" />))}
            {Array.from({ length: 16 }, (_, i) => (<ellipse key={`d-${i}`} cx={10 + i * 20} cy="8" rx="11" ry="10" fill="none" stroke={darkColor} strokeWidth="0.8" opacity="0.4" />))}
          </svg>
        </div>
      </div>
      <div className="w-[92%] relative" style={{ marginTop: 2 }}>
        <div className="absolute -left-2 top-0 bottom-0 w-6 rounded-bl-2xl overflow-hidden z-10">
          <div className="h-full" style={{ background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`, opacity: 0.7 }} />
        </div>
        <div className="absolute -right-2 top-0 bottom-0 w-6 rounded-br-2xl overflow-hidden z-10">
          <div className="h-full" style={{ background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`, opacity: 0.7 }} />
        </div>
        <div className="relative rounded-b-2xl overflow-hidden" style={{ backgroundColor: "#0f172a", border: `3px solid ${color}40`, boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.1)" }}>
          <div className="px-6 py-3 text-center" style={{ background: `linear-gradient(180deg, ${color}28 0%, ${color}12 100%)`, borderBottom: `2px solid ${color}35` }}>
            <h3 className="text-base font-bold uppercase tracking-[0.15em]" style={{ color, ...hFont }}>{title}</h3>
          </div>
          <div className="px-6 py-5 min-h-[187px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini Console (Leaderboard) ── */
function MiniConsole({ entries }: { entries: LeaderboardEntry[] }): React.JSX.Element {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1a2e, #121228)", border: "2px solid rgba(246,196,83,0.25)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(246,196,83,0.1)" }}>
        <div className="flex gap-2">
          {["#e84b5c", "#f6c453", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 6px ${c}66` }} />
          ))}
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(246,196,83,0.4)", ...hFont }}>Rankings</span>
      </div>
      <div className="px-4 py-3" style={{ background: "rgba(8,12,26,0.9)" }}>
        {entries.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "rgba(148,163,184,0.3)" }}>No data yet</div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 5).map((e, i) => (
              <div key={e.user_id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-4">{i < 3 ? medals[i] : <span style={{ color: "#475569" }}>{i + 1}</span>}</span>
                  <span className="text-[11px] text-slate-300 truncate max-w-24">{e.display_name || "User"}</span>
                </div>
                <span className="text-[9px] font-bold" style={{ color: "#f59e0b" }}>{e.xp_total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Boss Quest Card ── */
function BossQuestCard({ quest }: { quest: DashboardQuest }): React.JSX.Element {
  const xpR = quest.xpReward || quest.xp_reward || 0;
  const diff = quest.difficulty || "hard";
  return (
    <div className="relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
      style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "2px solid rgba(34,197,94,0.3)", boxShadow: "0 3px 18px rgba(34,197,94,0.15)" }}>
      <div className="h-2" style={{ background: "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)", boxShadow: "0 0 15px rgba(34,197,94,0.6)" }} />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1 min-w-0">
            <span className="text-base font-bold text-slate-200 block truncate">{quest.title}</span>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1.5px solid rgba(34,197,94,0.35)" }}>
                🔥 {diff}
              </span>
              <span className="text-[11px]" style={{ color: "rgba(148,163,184,0.4)" }}>•</span>
              <span className="text-[11px] font-bold" style={{ color: "rgba(34,197,94,0.7)" }}>RAID EVENT</span>
            </div>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <span className="text-2xl font-bold" style={{ color: "#4ade80", ...hFont }}>+{xpR}</span>
            <span className="text-[10px] font-bold uppercase" style={{ color: "rgba(34,197,94,0.7)" }}>XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */
export default function DashboardPage(): React.JSX.Element {
  const { data: leaderboard, loading: leaderboardLoading } = useLeaderboard();
  const { quests: allQuests, loading: allQuestsLoading } = useQuests();

  // Use the same user ID as the profile page
  const userId = "57d33940-2603-474d-b084-285aaf859a0e";
  const { quests: assignedQuests, loading: assignedQuestsLoading, refetch } = useAssignedQuests(userId);

  const [activeIndex, setActiveIndex] = useState(0);

  const name = "Jackson Zheng";
  const xp = 510;
  const streak = 2;

  const handleCompleteQuest = async (assignmentId: string) => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase
        .from("dailyQuestAssignment")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", assignmentId);

      if (error) {
        console.error("Failed to complete quest:", error);
        return;
      }

      // Refetch quests to update the UI
      refetch();
    } catch (err) {
      console.error("Error completing quest:", err);
    }
  };

  const currentColors = TENT_COLORS[activeIndex];
  const goLeft = useCallback(() => setActiveIndex((p) => (p === 0 ? TOTAL_TENTS - 1 : p - 1)), []);
  const goRight = useCallback(() => setActiveIndex((p) => (p === TOTAL_TENTS - 1 ? 0 : p + 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goLeft, goRight]);

  const bossQuests = allQuests.filter((q) => !q.is_daily);

  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-nunito)", background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)" }}>

      <ArcadeNavbar />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      {/* Blue accent glows */}
      <div className="fixed top-1/3 left-1/4 w-[400px] h-[400px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="fixed top-1/2 right-1/4 w-[350px] h-[350px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative text-center pt-24 pb-8 px-4">
        <p className="text-2xl md:text-3xl font-medium" style={{
          ...hFont,
          color: "#f1f5f9",
          textShadow: "0 2px 10px rgba(0,0,0,0.4)",
          letterSpacing: "0.02em"
        }}>
          Spin the carousel to explore
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          <ArcadeArrow direction="left" onClick={goLeft} color={currentColors.color} />

          <div className="relative w-full max-w-[680px] overflow-hidden" style={{ minHeight: 520 }}>
            <div className="transition-all duration-500 ease-in-out" key={activeIndex} style={{ animation: "tentFadeIn 0.4s ease-out" }}>

              {activeIndex === 0 && (
                <Tent {...TENT_COLORS[0]} title="Profile Stats">
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>Username</span>
                      <span className="text-2xl font-bold block text-slate-100" style={hFont}>{name}</span>
                    </div>
                    <div className="h-px" style={{ backgroundColor: "rgba(232,75,92,0.25)" }} />
                    <div className="flex justify-between gap-6">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>XP</span>
                        <span className="text-4xl font-bold" style={{ color: "#f59e0b", ...hFont }}>{xp.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>Streak</span>
                        <span className="text-4xl font-bold" style={{ color: "#e84b5c", ...hFont }}>🔥 {streak}</span>
                      </div>
                    </div>
                  </div>
                </Tent>
              )}

              {activeIndex === 1 && (
                <Tent {...TENT_COLORS[1]} title="Leaderboard">
                  {leaderboardLoading ? (
                    <div className="text-center py-8 text-sm text-slate-500">Loading...</div>
                  ) : (
                    <MiniConsole entries={leaderboard} />
                  )}
                </Tent>
              )}

              {activeIndex === 2 && (
                <Tent {...TENT_COLORS[2]} title="Quests">
                  {assignedQuestsLoading ? (
                    <div className="text-center py-12 text-base text-slate-500">Loading quests...</div>
                  ) : assignedQuests.length === 0 ? (
                    <div className="text-center py-12 text-base text-slate-500">No quests assigned today</div>
                  ) : (
                    <div className="space-y-3">
                      {assignedQuests.slice(0, 4).map((item) => (
                        <div key={item.quest.id} className="rounded-xl transition-all duration-200"
                          style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.2)", boxShadow: "0 3px 10px rgba(59,130,246,0.15)" }}>
                          <div className="flex items-center justify-between py-4 px-5">
                            <span className="text-base font-medium text-slate-300 truncate max-w-[280px]">{item.quest.title}</span>
                            <span className="text-sm font-bold shrink-0 px-4 py-2 rounded-full"
                              style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1.5px solid rgba(59,130,246,0.25)" }}>
                              +{item.quest.xp_reward} XP
                            </span>
                          </div>
                          <div className="px-5 pb-4">
                            <button
                              onClick={() => handleCompleteQuest(item.assignmentId)}
                              disabled={item.status === "completed"}
                              className="w-full py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                              style={{
                                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                                color: "#ffffff",
                                border: "2px solid rgba(96,165,250,0.4)",
                                boxShadow: "0 4px 15px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
                              }}>
                              {item.status === "completed" ? "✓ " : ""}Task Completed
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Tent>
              )}

              {activeIndex === 3 && (
                <Tent {...TENT_COLORS[3]} title="Boss Quests">
                  {allQuestsLoading || bossQuests.length === 0 ? (
                    <div className="text-center py-12 text-base text-slate-500">No boss quests available</div>
                  ) : (
                    <div className="space-y-3">
                      {bossQuests.slice(0, 3).map((q) => (
                        <BossQuestCard key={q.id} quest={q} />
                      ))}
                    </div>
                  )}
                </Tent>
              )}
            </div>
          </div>

          <ArcadeArrow direction="right" onClick={goRight} color={currentColors.color} />
        </div>
      </div>

      {/* Navigation at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex justify-center gap-3">
          {TENT_DATA.map((tent, i) => {
            const isActive = i === activeIndex;
            const tc = TENT_COLORS[i];
            return (
              <button key={i} onClick={() => setActiveIndex(i)} className="group relative transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${tc.color}25` : "rgba(15,23,42,0.85)",
                    border: `3px solid ${isActive ? tc.color : "rgba(148,163,184,0.2)"}`,
                    boxShadow: isActive ? `0 0 25px ${tc.glowColor}, 0 4px 15px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15)` : "0 3px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                    minWidth: isActive ? "160px" : "140px",
                    backdropFilter: "blur(10px)",
                  }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: isActive ? tc.color : "rgba(148,163,184,0.25)", boxShadow: isActive ? `0 0 15px ${tc.glowColor}` : "none" }}>
                    <span className="text-sm">{tent.icon}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    style={{ color: isActive ? tc.color : "rgba(148,163,184,0.6)", ...hFont }}>
                    {tent.name}
                  </span>
                  {isActive && (
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse ml-auto"
                      style={{ backgroundColor: tc.color, boxShadow: `0 0 10px ${tc.glowColor}` }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes tentFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </main>
  );
}
