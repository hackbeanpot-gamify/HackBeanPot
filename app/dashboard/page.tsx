"use client";

import { useState, useEffect } from "react";
import { Fredoka, Nunito } from "next/font/google";
import NextLink from "next/link";
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

/* ═══════════════════════════════════════════
   TENT COMPONENT — Redesigned
   ═══════════════════════════════════════════ */
function Tent({
  color,
  lightColor,
  darkColor,
  glowColor,
  title,
  href,
  children,
}: {
  color: string;
  lightColor: string;
  darkColor: string;
  glowColor: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <NextLink href={href} className="block group flex-1 min-w-[280px] max-w-[380px]">
      <div className="flex flex-col items-center transition-all duration-500 group-hover:-translate-y-4 group-hover:scale-[1.03]"
        style={{ filter: `drop-shadow(0 8px 25px ${glowColor})` }}>

        {/* ── FLAG ── */}
        <div className="relative z-10 mb-[-30px]">
          <div style={{ width: 4, height: 45, backgroundColor: darkColor, margin: "0 auto" }} />
          <div style={{
            width: 28, height: 20,
            backgroundColor: color,
            clipPath: "polygon(0 0, 100% 30%, 0 100%)",
            position: "absolute", top: 2, left: 6,
            filter: `drop-shadow(0 2px 4px ${glowColor})`,
          }} />
        </div>

        {/* ── TENT ROOF ── */}
        <div className="w-full relative" style={{ height: 130 }}>
          {/* Main cone shape */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            background: `linear-gradient(135deg, ${lightColor} 0%, ${color} 40%, ${darkColor} 100%)`,
          }} />

          {/* Stripe 1 */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(50% 0%, 58% 100%, 42% 100%)",
            backgroundColor: darkColor, opacity: 0.5,
          }} />
          {/* Stripe 2 left */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(50% 0%, 30% 100%, 18% 100%)",
            backgroundColor: darkColor, opacity: 0.3,
          }} />
          {/* Stripe 2 right */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(50% 0%, 82% 100%, 70% 100%)",
            backgroundColor: darkColor, opacity: 0.3,
          }} />

          {/* Shine highlight */}
          <div className="absolute inset-0" style={{
            clipPath: "polygon(50% 0%, 55% 100%, 45% 100%)",
            background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }} />

          {/* Scalloped valance at bottom */}
          <div className="absolute bottom-[-12px] left-0 right-0 flex justify-center">
            <svg viewBox="0 0 320 25" className="w-full" preserveAspectRatio="none">
              {Array.from({ length: 16 }, (_, i) => (
                <ellipse key={i} cx={10 + i * 20} cy="8" rx="11" ry="10" fill={color} opacity="0.85" />
              ))}
              {Array.from({ length: 16 }, (_, i) => (
                <ellipse key={`d-${i}`} cx={10 + i * 20} cy="8" rx="11" ry="10" fill="none" stroke={darkColor} strokeWidth="0.8" opacity="0.4" />
              ))}
            </svg>
          </div>
        </div>

        {/* ── TENT BODY ── */}
        <div className="w-[92%] relative" style={{ marginTop: 2 }}>
          {/* Side drapes */}
          <div className="absolute -left-2 top-0 bottom-0 w-5 rounded-bl-2xl overflow-hidden z-10">
            <div className="h-full" style={{
              background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 12px, ${darkColor} 12px, ${darkColor} 24px)`,
              opacity: 0.7,
            }} />
          </div>
          <div className="absolute -right-2 top-0 bottom-0 w-5 rounded-br-2xl overflow-hidden z-10">
            <div className="h-full" style={{
              background: `repeating-linear-gradient(180deg, ${color} 0px, ${color} 12px, ${darkColor} 12px, ${darkColor} 24px)`,
              opacity: 0.7,
            }} />
          </div>

          {/* Card body */}
          <div className="relative rounded-b-2xl overflow-hidden" style={{
            backgroundColor: "#0f172a",
            border: `2px solid ${color}40`,
            boxShadow: `0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Title bar */}
            <div className="px-5 py-3 text-center" style={{
              background: `linear-gradient(180deg, ${color}20 0%, ${color}08 100%)`,
              borderBottom: `1px solid ${color}25`,
            }}>
              <h3 className="text-sm font-bold uppercase tracking-[0.15em]" style={{ color, ...hFont }}>
                {title}
              </h3>
            </div>

            {/* Content */}
            <div className="px-5 py-5 min-h-[190px]">
              {children}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 text-center" style={{
              borderTop: `1px solid ${color}15`,
              background: `linear-gradient(180deg, transparent, ${color}05)`,
            }}>
              <span className="text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:tracking-[0.2em]" style={{ color: `${color}60` }}>
                Click to enter →
              </span>
            </div>
          </div>
        </div>
      </div>
    </NextLink>
  );
}

/* ═══════════════════════════════════════════
   MINI CONSOLE (inside yellow tent)
   ═══════════════════════════════════════════ */
function MiniConsole({ entries }: { entries: LeaderboardEntry[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: "linear-gradient(145deg, #1a1a2e, #121228)",
      border: "2px solid rgba(246,196,83,0.25)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(246,196,83,0.05)",
    }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(246,196,83,0.1)" }}>
        <div className="flex gap-1.5">
          {["#e84b5c", "#f6c453", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 4px ${c}66` }} />
          ))}
        </div>
        <span className="text-[7px] font-bold uppercase tracking-widest" style={{ color: "rgba(246,196,83,0.4)", ...hFont }}>Rankings</span>
      </div>
      <div className="px-3 py-2.5" style={{ background: "rgba(8,12,26,0.9)" }}>
        {entries.length === 0 ? (
          <div className="text-center py-3 text-[10px]" style={{ color: "rgba(148,163,184,0.3)" }}>No data yet</div>
        ) : (
          <div className="space-y-1.5">
            {entries.slice(0, 5).map((e, i) => {
              const name = e.display_name || e.displayName || e.username || "User";
              return (
                <div key={e.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] w-4">{i < 3 ? medals[i] : <span style={{ color: "#475569" }}>{i + 1}</span>}</span>
                    <span className="text-[11px] text-slate-300 truncate max-w-[90px]">{name}</span>
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: "#f59e0b" }}>{(e.xp || 0).toLocaleString()}</span>
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
  const profile = useProfile("21972c6e-f716-46ed-81b6-e37ff8adcdae");
  const leaderboard = useLeaderboard(5);
  const quests = useQuests(5);

  const name = profile?.display_name || profile?.displayName || profile?.username || profile?.email || "Quester";
  const xp = profile?.xp || 0;
  const streak = profile?.currentStreak || profile?.current_streak || 0;

  return (
    <main className={`${fredoka.variable} ${nunito.variable} min-h-screen`}
      style={{ fontFamily: "var(--font-nunito)", background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)" }}>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <div className="relative text-center pt-24 pb-6 px-4">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(245,158,11,0.35)", ...hFont }}>
          🎪 Welcome to the Carnival 🎪
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold" style={{
          ...hFont, color: "rgb(248 250 252)",
          textShadow: "0 0 30px rgba(245,158,11,0.1)",
        }}>Dashboard</h1>
        <p className="mt-3 text-base text-slate-400">
          Hey <span className="font-bold text-amber-300">{name}</span>! Pick a tent to get started.
        </p>
      </div>

      {/* ═══ 3 TENTS ═══ */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-start justify-center gap-12">

          {/* 🔴 Red Tent: Profile */}
          <Tent
            color="#e84b5c" lightColor="#f47182" darkColor="#b83a4a"
            glowColor="rgba(232,75,92,0.15)"
            title="Profile Stats" href="/profile"
          >
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>Username</span>
                <span className="text-lg font-bold block text-slate-100" style={hFont}>{name}</span>
              </div>
              <div className="h-px" style={{ backgroundColor: "rgba(232,75,92,0.15)" }} />
              <div className="flex justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>XP</span>
                  <span className="text-2xl font-bold" style={{ color: "#f59e0b", ...hFont }}>{xp.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-bold block mb-1" style={{ color: "rgba(232,75,92,0.5)" }}>Streak</span>
                  <span className="text-2xl font-bold" style={{ color: "#e84b5c", ...hFont }}>🔥 {streak}</span>
                </div>
              </div>
            </div>
          </Tent>

          {/* 🟡 Yellow Tent: Leaderboard */}
          <Tent
            color="#f6c453" lightColor="#fad97a" darkColor="#c99a2e"
            glowColor="rgba(246,196,83,0.15)"
            title="Leaderboard" href="/leaderboard"
          >
            <MiniConsole entries={leaderboard} />
          </Tent>

          {/* 🔵 Blue Tent: Quests */}
          <Tent
            color="#3b82f6" lightColor="#60a5fa" darkColor="#2563eb"
            glowColor="rgba(59,130,246,0.15)"
            title="Quests" href="/quests"
          >
            {quests.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500">Loading quests...</div>
            ) : (
              <div className="space-y-2">
                {quests.slice(0, 4).map((q) => {
                  const xpR = q.xpReward || q.xp_reward || 0;
                  return (
                    <div key={q.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
                      style={{ backgroundColor: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                      <span className="text-[12px] text-slate-300 truncate max-w-[150px]">{q.title}</span>
                      <span className="text-[10px] font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
                        +{xpR} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Tent>

        </div>
      </div>
    </main>
  );
}