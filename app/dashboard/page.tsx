"use client";

import { useState, useEffect } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { useQuests } from "@/lib/hooks/useQuests";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { LeaderboardEntry } from "@/types";
import ArcadeNavbar from "@/components/ArcadeNavbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] });
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

/* ═══════════════════════════════════════════
   ARCADE CAROUSEL ARROW
   ═══════════════════════════════════════════ */
function ArcadeArrow({ direction, onClick, color }: { direction: "left" | "right"; onClick: () => void; color: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex-shrink-0"
      aria-label={`${direction === "left" ? "Previous" : "Next"} tent`}
    >
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 20px ${color}40, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {direction === "left" ? (
          <ChevronLeft className="w-10 h-10" style={{ color }} />
        ) : (
          <ChevronRight className="w-10 h-10" style={{ color }} />
        )}
      </div>
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
          filter: "blur(12px)",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════════════
   TENT COMPONENT - BIGGER & MORE READABLE
   ═══════════════════════════════════════════ */
function Tent({
  color,
  lightColor,
  darkColor,
  glowColor,
  title,
  children,
}: {
  color: string;
  lightColor: string;
  darkColor: string;
  glowColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-[520px] mx-auto" style={{ filter: `drop-shadow(0 10px 35px ${glowColor})` }}>
      {/* Flag */}
      <div className="relative z-10 mb-[-40px]">
        <div style={{ width: 6, height: 65, backgroundColor: darkColor, margin: "0 auto" }} />
        <div style={{
          width: 38, height: 28, backgroundColor: color,
          clipPath: "polygon(0 0, 100% 30%, 0 100%)",
          position: "absolute", top: 2, left: 8,
          filter: `drop-shadow(0 3px 8px ${glowColor})`,
        }} />
      </div>

      {/* Roof */}
      <div className="w-full relative" style={{ height: 180 }}>
        <div className="absolute inset-0" style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: `linear-gradient(135deg, ${lightColor} 0%, ${color} 40%, ${darkColor} 100%)`,
        }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 58% 100%, 42% 100%)", backgroundColor: darkColor, opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 30% 100%, 18% 100%)", backgroundColor: darkColor, opacity: 0.3 }} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(50% 0%, 82% 100%, 70% 100%)", backgroundColor: darkColor, opacity: 0.3 }} />
        <div className="absolute inset-0" style={{
          clipPath: "polygon(50% 0%, 55% 100%, 45% 100%)",
          background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)`,
        }} />

        {/* Scalloped valance */}
        <div className="absolute bottom-[-14px] left-0 right-0 flex justify-center">
          <svg viewBox="0 0 380 28" className="w-full" preserveAspectRatio="none">
            {Array.from({ length: 19 }, (_, i) => (
              <ellipse key={i} cx={10 + i * 20} cy="10" rx="12" ry="11" fill={color} opacity="0.85" />
            ))}
            {Array.from({ length: 19 }, (_, i) => (
              <ellipse key={`d-${i}`} cx={10 + i * 20} cy="10" rx="12" ry="11" fill="none" stroke={darkColor} strokeWidth="0.9" opacity="0.4" />
            ))}
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className="w-[92%] relative" style={{ marginTop: 2 }}>
        {/* Side drapes */}
        <div className="absolute -left-2 top-0 bottom-0 w-6 rounded-bl-2xl overflow-hidden z-10">
          <div className="h-full" style={{
            background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`,
            opacity: 0.7,
          }} />
        </div>
        <div className="absolute -right-2 top-0 bottom-0 w-6 rounded-br-2xl overflow-hidden z-10">
          <div className="h-full" style={{
            background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 14px, ${darkColor} 14px, ${darkColor} 28px)`,
            opacity: 0.7,
          }} />
        </div>

        {/* Card body */}
        <div className="relative rounded-b-2xl overflow-hidden" style={{
          backgroundColor: "#0f172a",
          border: `3px solid ${color}40`,
          boxShadow: `0 18px 45px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}>
          {/* Title bar */}
          <div className="px-6 py-4 text-center" style={{
            background: `linear-gradient(180deg, ${color}25 0%, ${color}10 100%)`,
            borderBottom: `2px solid ${color}30`,
          }}>
            <h3 className="text-base font-bold uppercase tracking-[0.18em]" style={{ color, ...hFont }}>
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-7 py-7 min-h-[240px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MINI CONSOLE - BIGGER TEXT
   ═══════════════════════════════════════════ */
function MiniConsole({ entries }: { entries: LeaderboardEntry[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "linear-gradient(145deg, #1a1a2e, #121228)",
      border: "2px solid rgba(246,196,83,0.3)",
      boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(246,196,83,0.15)" }}>
        <div className="flex gap-2.5">
          {["#e84b5c", "#f6c453", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 8px ${c}66` }} />
          ))}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(246,196,83,0.4)", ...hFont }}>Rankings</span>
      </div>
      <div className="px-5 py-4" style={{ background: "rgba(8,12,26,0.9)" }}>
        {entries.length === 0 ? (
          <div className="text-center py-6 text-sm" style={{ color: "rgba(148,163,184,0.3)" }}>No data yet</div>
        ) : (
          <div className="space-y-2.5">
            {entries.slice(0, 5).map((e, i) => {
              const name = e.display_name || "User";
              return (
                <div key={e.user_id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-5">{i < 3 ? medals[i] : <span style={{ color: "#475569" }}>{i + 1}</span>}</span>
                    <span className="text-sm text-slate-300 truncate max-w-[110px]">{name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>{e.xp_total.toLocaleString()}</span>
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
   DASHBOARD
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const { data: leaderboard, loading: leaderboardLoading } = useLeaderboard();
  const { quests, loading: questsLoading } = useQuests();
  const [activeIndex, setActiveIndex] = useState(0);

  // For now using placeholder profile data - will connect to auth later
  const name = "Quester";
  const xp = 0;
  const streak = 0;

  const TOTAL_TENTS = 3;

  const tentColors = [
    { color: "#e84b5c", lightColor: "#f47182", darkColor: "#b83a4a", glowColor: "rgba(232,75,92,0.25)" },
    { color: "#f6c453", lightColor: "#fad97a", darkColor: "#c99a2e", glowColor: "rgba(246,196,83,0.25)" },
    { color: "#3b82f6", lightColor: "#60a5fa", darkColor: "#2563eb", glowColor: "rgba(59,130,246,0.25)" },
  ];

  const tentData = [
    { name: "Profile", icon: "👤" },
    { name: "Leaderboard", icon: "🏆" },
    { name: "Quests", icon: "🎯" },
  ];

  const currentColors = tentColors[activeIndex];

  const goLeft = () => setActiveIndex((prev) => (prev === 0 ? TOTAL_TENTS - 1 : prev - 1));
  const goRight = () => setActiveIndex((prev) => (prev === TOTAL_TENTS - 1 ? 0 : prev + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goLeft();
      if (e.key === "ArrowRight") goRight();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-nunito)", background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)" }}>

      <ArcadeNavbar />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <div className="relative text-center pt-32 pb-10 px-4">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,158,11,0.4)", ...hFont }}>
          🎪 Welcome to the Carnival 🎪
        </p>
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-4" style={{
          ...hFont,
          color: "rgb(248 250 252)",
          textShadow: "0 0 35px rgba(245,158,11,0.15)",
        }}>
          Dashboard
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Hey <span className="font-bold text-amber-300">{name}</span>! Spin the carousel to explore.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-8 md:gap-12">
          {/* Left Arrow */}
          <ArcadeArrow direction="left" onClick={goLeft} color={currentColors.color} />

          {/* Tent Container - BIGGER */}
          <div className="relative w-full max-w-[540px] overflow-hidden" style={{ minHeight: 620 }}>
            <div className="transition-all duration-500 ease-in-out" key={activeIndex}
              style={{ animation: "tentFadeIn 0.5s ease-out" }}>

              {/* Tent 0: Profile */}
              {activeIndex === 0 && (
                <Tent {...tentColors[0]} title="Profile Stats">
                  <div className="space-y-6">
                    <div>
                      <span className="text-sm uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>Username</span>
                      <span className="text-2xl font-bold block text-slate-100" style={hFont}>{name}</span>
                    </div>
                    <div className="h-px" style={{ backgroundColor: "rgba(232,75,92,0.2)" }} />
                    <div className="flex justify-between gap-4">
                      <div>
                        <span className="text-sm uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>XP</span>
                        <span className="text-4xl font-bold" style={{ color: "#f59e0b", ...hFont }}>{xp.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm uppercase tracking-wider font-bold block mb-2" style={{ color: "rgba(232,75,92,0.6)" }}>Streak</span>
                        <span className="text-4xl font-bold" style={{ color: "#e84b5c", ...hFont }}>🔥 {streak}</span>
                      </div>
                    </div>
                  </div>
                </Tent>
              )}

              {/* Tent 1: Leaderboard */}
              {activeIndex === 1 && (
                <Tent {...tentColors[1]} title="Leaderboard">
                  {leaderboardLoading ? (
                    <div className="text-center py-12 text-base text-slate-500">Loading...</div>
                  ) : (
                    <MiniConsole entries={leaderboard} />
                  )}
                </Tent>
              )}

              {/* Tent 2: Quests */}
              {activeIndex === 2 && (
                <Tent {...tentColors[2]} title="Quests">
                  {questsLoading || quests.length === 0 ? (
                    <div className="text-center py-12 text-base text-slate-500">Loading quests...</div>
                  ) : (
                    <div className="space-y-3">
                      {quests.slice(0, 5).map((q) => (
                        <div key={q.id} className="flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                          style={{ backgroundColor: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.15)" }}>
                          <span className="text-base text-slate-200 truncate max-w-[280px] font-medium">{q.title}</span>
                          <span className="text-sm font-bold flex-shrink-0 px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", ...hFont }}>
                            +{q.xp_reward} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Tent>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <ArcadeArrow direction="right" onClick={goRight} color={currentColors.color} />
        </div>

        {/* Pill Indicators - BIGGER */}
        <div className="flex justify-center gap-4 mt-12">
          {tentData.map((tent, i) => {
            const isActive = i === activeIndex;
            const tentColor = tentColors[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="group relative transition-all duration-300 hover:-translate-y-1"
                style={{ cursor: "pointer" }}
              >
                {/* Pill container - BIGGER */}
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${tentColor.color}18` : "rgba(15,23,42,0.6)",
                    border: `2px solid ${isActive ? tentColor.color : "rgba(148,163,184,0.15)"}`,
                    boxShadow: isActive
                      ? `0 0 25px ${tentColor.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                      : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    minWidth: isActive ? "160px" : "140px",
                  }}
                >
                  {/* Icon circle - BIGGER */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? tentColor.color : "rgba(148,163,184,0.2)",
                      boxShadow: isActive ? `0 0 12px ${tentColor.glowColor}` : "none",
                    }}
                  >
                    <span className="text-sm">{tent.icon}</span>
                  </div>

                  {/* Label - BIGGER */}
                  <span
                    className="text-sm font-bold uppercase tracking-wide transition-all duration-300"
                    style={{
                      color: isActive ? tentColor.color : "rgba(148,163,184,0.4)",
                      ...hFont,
                    }}
                  >
                    {tent.name}
                  </span>

                  {/* Active indicator LED */}
                  {isActive && (
                    <div
                      className="w-2.5 h-2.5 rounded-full animate-pulse ml-auto"
                      style={{
                        backgroundColor: tentColor.color,
                        boxShadow: `0 0 10px ${tentColor.glowColor}`,
                      }}
                    />
                  )}
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${tentColor.glowColor} 0%, transparent 70%)`,
                    filter: "blur(18px)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Keyboard hint */}
        <div className="text-center mt-8">
          <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.3)" }}>
            Use ← → arrow keys to navigate
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes tentFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </main>
  );
}
