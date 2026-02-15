"use client";

import { useState, useEffect } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] });
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

interface Profile {
  id: string; email?: string | null; display_name?: string | null;
  displayName?: string | null; username?: string | null;
  xp?: number | null; level?: number | null;
  currentStreak?: number | null; current_streak?: number | null;
}
interface LeaderboardEntry {
  id: string; username?: string | null; display_name?: string | null;
  displayName?: string | null; xp?: number | null; level?: number | null;
  currentStreak?: number | null; current_streak?: number | null;
}
interface Quest {
  id: number; title: string; xpReward?: number | null; xp_reward?: number | null;
  difficulty?: string | null;
}

function useProfile(id: string) {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => { (async () => { const sb = createClient(); const { data } = await sb.from("profiles").select("*").eq("id", id).single(); if (data) setP(data); })(); }, [id]);
  return p;
}
function useLeaderboard(n = 5) {
  const [e, setE] = useState<LeaderboardEntry[]>([]);
  useEffect(() => { (async () => { const sb = createClient(); const { data } = await sb.from("cityLeaderboard").select("*").limit(n); if (data) setE(data); })(); }, [n]);
  return e;
}
function useQuests(n = 5) {
  const [q, setQ] = useState<Quest[]>([]);
  useEffect(() => { (async () => { const sb = createClient(); const { data } = await sb.from("quests").select("*").limit(n); if (data) setQ(data); })(); }, [n]);
  return q;
}
function useBossQuests(n = 4) {
  const [q, setQ] = useState<Quest[]>([]);
  useEffect(() => { (async () => { const sb = createClient(); const { data } = await sb.from("quests").select("*").eq("isDaily", false).limit(n); if (data) setQ(data); })(); }, [n]);
  return q;
}

/* ═══════════════════════════════════════════
   TENT — Redesigned with SVG curved roof
   ═══════════════════════════════════════════ */
function Tent({
  color, lightColor, darkColor, glowColor, title, flamboyant, children,
}: {
  color: string; lightColor: string; darkColor: string;
  glowColor: string; title: string; flamboyant?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-[420px] mx-auto">

      {/* ── SVG TENT ROOF ── */}
      <svg viewBox="0 0 400 200" className="w-full" style={{
        marginBottom: "-6px",
        filter: `drop-shadow(0 6px 20px ${glowColor})`,
      }}>
        <defs>
          {/* Main tent shape with curved sides */}
          <clipPath id={`tent-${title.replace(/\s/g, '')}`}>
            <path d="M200 8 C200 8, 385 175, 390 185 Q395 195, 380 195 L20 195 Q5 195, 10 185 C15 175, 200 8, 200 8 Z" />
          </clipPath>
        </defs>

        {/* Main fabric */}
        <g clipPath={`url(#tent-${title.replace(/\s/g, '')})`}>
          {/* Base gradient */}
          <rect x="0" y="0" width="400" height="200" fill={color} />
          <rect x="0" y="0" width="400" height="200" fill="url(#none)" style={{
            fill: `${darkColor}`,
            opacity: 0.3,
          }} />

          {/* Fabric stripes radiating from top */}
          <polygon points="200,8 170,200 140,200" fill={darkColor} opacity="0.35" />
          <polygon points="200,8 230,200 260,200" fill={darkColor} opacity="0.35" />
          <polygon points="200,8 100,200 70,200" fill={darkColor} opacity="0.2" />
          <polygon points="200,8 300,200 330,200" fill={darkColor} opacity="0.2" />
          <polygon points="200,8 40,200 10,200" fill={darkColor} opacity="0.15" />
          <polygon points="200,8 360,200 390,200" fill={darkColor} opacity="0.15" />

          {/* Center highlight (fabric shine) */}
          <polygon points="200,8 210,200 190,200" fill="white" opacity="0.15" />
          <polygon points="200,8 205,200 195,200" fill="white" opacity={flamboyant ? "0.25" : "0.1"} />

          {/* Extra flamboyant stripes */}
          {flamboyant && (
            <>
              <polygon points="200,8 55,200 25,200" fill={lightColor} opacity="0.2" />
              <polygon points="200,8 345,200 375,200" fill={lightColor} opacity="0.2" />
            </>
          )}

          {/* Bottom gradient fade for depth */}
          <rect x="0" y="150" width="400" height="50" fill={darkColor} opacity="0.3" />
        </g>

        {/* Tent outline with curve */}
        <path d="M200 8 C200 8, 385 175, 390 185 Q395 195, 380 195 L20 195 Q5 195, 10 185 C15 175, 200 8, 200 8 Z"
          fill="none" stroke={darkColor} strokeWidth="2" opacity="0.5" />

        {/* Scalloped valance along bottom */}
        {Array.from({ length: 20 }, (_, i) => {
          const cx = 15 + i * 19.5;
          return (
            <g key={i}>
              <ellipse cx={cx} cy="194" rx="10.5" ry="9"
                fill={flamboyant && i % 2 === 0 ? lightColor : color}
                stroke={darkColor} strokeWidth="0.6" opacity="0.9" />
            </g>
          );
        })}

        {/* Flag pole */}
        <line x1="200" y1="0" x2="200" y2="14" stroke={darkColor} strokeWidth="3" strokeLinecap="round" />

        {/* Flag */}
        <path d={`M201 1 L222 8 L201 15 Z`} fill={color} stroke={darkColor} strokeWidth="0.5">
          <animate attributeName="d" values="M201 1 L222 8 L201 15 Z;M201 1 L220 9 L201 15 Z;M201 1 L222 8 L201 15 Z" dur="3s" repeatCount="indefinite" />
        </path>
        {flamboyant && (
          <path d="M201 16 L216 21 L201 26 Z" fill={lightColor} stroke={darkColor} strokeWidth="0.4" opacity="0.8" />
        )}

        {/* Ball ornament on top */}
        <circle cx="200" cy="1" r="4" fill={lightColor} stroke={darkColor} strokeWidth="1" />
      </svg>

      {/* ── TENT BODY ── */}
      <div className="w-[88%] relative">
        {/* Side curtains */}
        <div className="absolute -left-3 top-0 bottom-4 w-7 rounded-bl-2xl overflow-hidden z-10"
          style={{ boxShadow: `inset -3px 0 8px rgba(0,0,0,0.2)` }}>
          <div className="h-full" style={{
            background: flamboyant
              ? `repeating-linear-gradient(180deg, ${color} 0px, ${color} 10px, ${darkColor} 10px, ${darkColor} 20px, ${lightColor} 20px, ${lightColor} 30px)`
              : `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`,
            opacity: 0.75,
          }} />
        </div>
        <div className="absolute -right-3 top-0 bottom-4 w-7 rounded-br-2xl overflow-hidden z-10"
          style={{ boxShadow: `inset 3px 0 8px rgba(0,0,0,0.2)` }}>
          <div className="h-full" style={{
            background: flamboyant
              ? `repeating-linear-gradient(180deg, ${color} 0px, ${color} 10px, ${darkColor} 10px, ${darkColor} 20px, ${lightColor} 20px, ${lightColor} 30px)`
              : `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`,
            opacity: 0.75,
          }} />
        </div>

        {/* Main card */}
        <div className="relative rounded-b-2xl overflow-hidden" style={{
          backgroundColor: "#0e1629",
          border: `2px solid ${color}${flamboyant ? '50' : '30'}`,
          boxShadow: flamboyant
            ? `0 20px 50px rgba(0,0,0,0.5), 0 0 35px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.04)`
            : `0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}>
          {/* Title banner */}
          <div className="px-6 py-3.5 text-center relative" style={{
            background: `linear-gradient(180deg, ${color}18 0%, transparent 100%)`,
            borderBottom: `1px solid ${color}20`,
          }}>
            {flamboyant && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: `repeating-linear-gradient(90deg, transparent, transparent 18px, ${color}08 18px, ${color}08 20px)`,
                }} />
              </div>
            )}
            <h3 className="text-base font-bold uppercase tracking-[0.18em] relative" style={{ color, ...hFont }}>
              {flamboyant ? `⚔️ ${title} ⚔️` : title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-5 min-h-[230px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINI CONSOLE
   ═══════════════════════════════════════════ */
function MiniConsole({ entries }: { entries: LeaderboardEntry[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "linear-gradient(145deg, #1a1a2e, #121228)",
      border: "2px solid rgba(246,196,83,0.25)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    }}>
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
            {entries.slice(0, 5).map((e, i) => {
              const name = e.display_name || e.displayName || e.username || "User";
              return (
                <div key={e.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm w-5 text-center">{i < 3 ? medals[i] : <span style={{ color: "#475569" }}>{i + 1}</span>}</span>
                    <span className="text-sm text-slate-300 truncate max-w-[120px]">{name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>{(e.xp || 0).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CAROUSEL ARROW
   ═══════════════════════════════════════════ */
function CarouselArrow({ direction, onClick, color }: { direction: "left" | "right"; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        width: 56, height: 56, borderRadius: "50%",
        backgroundColor: "rgba(15,23,42,0.8)",
        border: `2px solid ${color}40`,
        boxShadow: `0 0 20px ${color}15`,
        cursor: "pointer",
      }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════
   BOSS QUEST CARD
   ═══════════════════════════════════════════ */
function BossQuestCard({ quest }: { quest: Quest }) {
  const xpR = quest.xpReward || quest.xp_reward || 0;
  const diff = quest.difficulty || "hard";
  return (
    <div className="relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{ backgroundColor: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)", boxShadow: "0 0 12px rgba(34,197,94,0.05)" }}>
      <div className="h-1" style={{ background: "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)", boxShadow: "0 0 10px rgba(34,197,94,0.4)" }} />
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-200 block truncate">{quest.title}</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                🔥 {diff}
              </span>
              <span className="text-[9px]" style={{ color: "rgba(148,163,184,0.4)" }}>•</span>
              <span className="text-[9px] font-bold" style={{ color: "rgba(34,197,94,0.5)" }}>RAID EVENT</span>
            </div>
          </div>
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="text-lg font-bold" style={{ color: "#4ade80", ...hFont }}>+{xpR}</span>
            <span className="text-[8px] font-bold uppercase" style={{ color: "rgba(34,197,94,0.5)" }}>XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const profile = useProfile("21972c6e-f716-46ed-81b6-e37ff8adcdae");
  const leaderboard = useLeaderboard(5);
  const quests = useQuests(5);
  const bossQuests = useBossQuests(4);
  const [activeIndex, setActiveIndex] = useState(0);

  const name = profile?.display_name || profile?.displayName || profile?.username || profile?.email || "Quester";
  const xp = profile?.xp || 0;
  const streak = profile?.currentStreak || profile?.current_streak || 0;

  const TOTAL = 4;
  const tentColors = [
    { color: "#e84b5c", lightColor: "#f47182", darkColor: "#b83a4a", glowColor: "rgba(232,75,92,0.2)" },
    { color: "#f6c453", lightColor: "#fad97a", darkColor: "#c99a2e", glowColor: "rgba(246,196,83,0.2)" },
    { color: "#3b82f6", lightColor: "#60a5fa", darkColor: "#2563eb", glowColor: "rgba(59,130,246,0.2)" },
    { color: "#22c55e", lightColor: "#4ade80", darkColor: "#16a34a", glowColor: "rgba(34,197,94,0.25)" },
  ];
  const tentNames = ["Profile Stats", "Leaderboard", "Quests", "Boss Quests"];
  const cur = tentColors[activeIndex];

  const goLeft = () => setActiveIndex((p) => (p === 0 ? TOTAL - 1 : p - 1));
  const goRight = () => setActiveIndex((p) => (p === TOTAL - 1 ? 0 : p + 1));

  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-nunito)", background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)" }}>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      <div className="relative text-center pt-24 pb-6 px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold" style={{
          ...hFont, color: "rgb(248 250 252)", textShadow: "0 0 30px rgba(245,158,11,0.1)",
        }}>Dashboard</h1>
        <p className="mt-3 text-base text-slate-400">
          Hey <span className="font-bold text-amber-300">{name}</span>! Spin the carousel to explore.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <CarouselArrow direction="left" onClick={goLeft} color={cur.color} />

          <div className="relative w-full max-w-[440px]" style={{ minHeight: 540 }}>
            <div key={activeIndex} style={{ animation: "tentFadeIn 0.4s ease-out" }}>

              {activeIndex === 0 && (
                <Tent {...tentColors[0]} title="Profile Stats">
                  <div className="space-y-5">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>Username</span>
                      <span className="text-xl font-bold block text-slate-100" style={hFont}>{name}</span>
                      {profile?.email && <span className="text-xs block mt-0.5" style={{ color: "rgba(148,163,184,0.5)" }}>{profile.email}</span>}
                    </div>
                    <div className="h-px" style={{ backgroundColor: "rgba(232,75,92,0.15)" }} />
                    <div className="flex justify-between">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>XP</span>
                        <span className="text-3xl font-bold" style={{ color: "#f59e0b", ...hFont }}>{xp.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>Streak</span>
                        <span className="text-3xl font-bold" style={{ color: "#e84b5c", ...hFont }}>🔥 {streak}</span>
                      </div>
                    </div>
                  </div>
                </Tent>
              )}

              {activeIndex === 1 && (
                <Tent {...tentColors[1]} title="Leaderboard">
                  <MiniConsole entries={leaderboard} />
                </Tent>
              )}

              {activeIndex === 2 && (
                <Tent {...tentColors[2]} title="Quests">
                  {quests.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-500">Loading quests...</div>
                  ) : (
                    <div className="space-y-2.5">
                      {quests.slice(0, 5).map((q) => {
                        const xpR = q.xpReward || q.xp_reward || 0;
                        return (
                          <div key={q.id} className="flex items-center justify-between py-3 px-4 rounded-xl"
                            style={{ backgroundColor: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                            <span className="text-sm text-slate-300 truncate max-w-[200px]">{q.title}</span>
                            <span className="text-[11px] font-bold flex-shrink-0 px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>+{xpR} XP</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Tent>
              )}

              {activeIndex === 3 && (
                <Tent {...tentColors[3]} title="Boss Quests" flamboyant>
                  {bossQuests.length === 0 ? (
                    <div className="text-center py-6">
                      <span className="text-3xl block mb-3">⚔️</span>
                      <span className="text-sm font-bold block mb-1" style={{ color: "#4ade80", ...hFont }}>No Boss Quests Active</span>
                      <span className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>Check back for raid events!</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full inline-block"
                          style={{ color: "#4ade80", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", boxShadow: "0 0 12px rgba(34,197,94,0.1)" }}>
                          ⚔️ Raid Events Active ⚔️
                        </span>
                      </div>
                      {bossQuests.slice(0, 4).map((q) => <BossQuestCard key={q.id} quest={q} />)}
                    </div>
                  )}
                </Tent>
              )}
            </div>
          </div>

          <CarouselArrow direction="right" onClick={goRight} color={cur.color} />
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {tentNames.map((tName, i) => (
            <button key={i} onClick={() => setActiveIndex(i)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeIndex ? `${tentColors[i].color}20` : "transparent",
                border: `1.5px solid ${i === activeIndex ? tentColors[i].color : "rgba(148,163,184,0.15)"}`,
                cursor: "pointer",
              }}>
              <div className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === activeIndex ? tentColors[i].color : "rgba(148,163,184,0.25)",
                  boxShadow: i === activeIndex ? `0 0 8px ${tentColors[i].glowColor}` : "none",
                }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{
                color: i === activeIndex ? tentColors[i].color : "rgba(148,163,184,0.3)", ...hFont,
              }}>{tName}</span>
            </button>
          ))}
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