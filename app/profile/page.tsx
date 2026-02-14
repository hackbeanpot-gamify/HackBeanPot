"use client";

import { useState, useEffect } from "react";
import { Fredoka, Nunito } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["400", "500", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", weight: ["400", "500", "600", "700", "800"] });
const hFont = { fontFamily: "var(--font-fredoka)" } as const;

// Matches your actual DB columns (snake_case)
interface Profile {
  id: string; email?: string | null; username?: string | null;
  display_name?: string | null; displayName?: string | null;
  avatarUrl?: string | null; avatar_url?: string | null;
  city?: string | null; xp?: number | null; level?: number | null;
  currentStreak?: number | null; current_streak?: number | null;
  longestStreak?: number | null; longest_streak?: number | null;
  createdAt?: string | null; created_at?: string | null;
  id: string;
  email?: string | null;
  username?: string | null;
  display_name?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  timezone?: string | null;
  xp?: number | null;
  level?: number | null;
  currentStreak?: number | null;
  current_streak?: number | null;
  longestStreak?: number | null;
  longest_streak?: number | null;
  streakLastDate?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
}

// Safe getters that handle both camelCase and snake_case
function getName(p: Profile): string {
  return p.display_name || p.displayName || p.username || p.email || "Unknown";
}
function getAvatar(p: Profile): string | null {
  return p.avatarUrl || p.avatar_url || null;
}
function getXp(p: Profile): number {
  return p.xp || 0;
}
function getLevel(p: Profile): number {
  return p.level || 1;
}
function getCurrentStreak(p: Profile): number {
  return p.currentStreak || p.current_streak || 0;
}
function getLongestStreak(p: Profile): number {
  return p.longestStreak || p.longest_streak || 0;
}
function getCreatedAt(p: Profile): string {
  return p.createdAt || p.created_at || new Date().toISOString();
}

function getName(p: Profile) { return p.display_name || p.displayName || p.username || p.email || "Unknown"; }
function getAvatar(p: Profile) { return p.avatarUrl || p.avatar_url || null; }
function getXp(p: Profile) { return p.xp || 0; }
function getLevel(p: Profile) { return p.level || 1; }
function getStreak(p: Profile) { return p.currentStreak || p.current_streak || 0; }
function getBest(p: Profile) { return p.longestStreak || p.longest_streak || 0; }
function getDate(p: Profile) { return p.createdAt || p.created_at || new Date().toISOString(); }
function xpForLevel(l: number) { return 250 * l * (l - 1); }

function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const sb = createClient();
        const { data, error: e } = await sb.from("profiles").select("*").eq("id", userId).single();
        if (e) throw e;
        setProfile(data);
      } catch (e: any) { setError(e.message || "Failed to load"); }
      setLoading(false);
    })();
  }, [userId]);
  return { profile, loading, error };
}

export default function ProfilePage() {
  const DEMO_USER_ID = "21972c6e-f716-46ed-81b6-e37ff8adcdae";
  const { profile, loading, error } = useProfile(DEMO_USER_ID);

  if (loading) return (
    <div className={`${fredoka.variable} ${nunito.variable} min-h-screen flex items-center justify-center`} style={{ backgroundColor: "#0B1120" }}>
      <div className="w-12 h-12 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "#3b82f6", borderTopColor: "transparent" }} />
    </div>
  );

  if (error || !profile) return (
    <div className={`${fredoka.variable} ${nunito.variable} min-h-screen flex items-center justify-center`} style={{ backgroundColor: "#0B1120" }}>
      <div className="rounded-xl p-8 text-center max-w-sm" style={{ backgroundColor: "rgba(15,23,42,0.9)", border: "1px solid rgba(59,130,246,0.4)" }}>
        <span className="text-4xl block mb-3">😔</span>
        <span className="text-sm" style={{ color: "#3b82f6" }}>{error || "Profile not found"}</span>
      </div>
    </div>
  );

  const name = getName(profile);
  const avatar = getAvatar(profile);
  const xp = getXp(profile);
  const level = getLevel(profile);
  const streak = getCurrentStreak(profile);
  const bestStreak = getLongestStreak(profile);
  const createdAt = getCreatedAt(profile);

  const curXp = xpForLevel(level);
  const nxtXp = xpForLevel(level + 1);
  const inLvl = xp - curXp;
  const needed = nxtXp - curXp;
  const pct = needed > 0 ? Math.min(Math.max((inLvl / needed) * 100, 0), 100) : 0;

  return (
    <div className={`${fredoka.variable} ${nunito.variable} min-h-screen flex flex-col items-center justify-center px-4 py-12`}
      style={{ fontFamily: "var(--font-nunito)", background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)" }}>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />

      <h1 className="relative text-4xl md:text-5xl font-extrabold mb-8 tracking-tight uppercase"
        style={{ ...hFont, color: "#e84b5c", textShadow: "0 0 30px rgba(232,75,92,0.3), 0 2px 0 rgba(0,0,0,0.3)" }}>
        Your Profile
      </h1>

      {/* ═══ CONSOLE BODY ═══ */}
      <div className="relative w-full max-w-[900px]" style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 50%, #121228 100%)",
        borderRadius: "28px 28px 48px 48px",
        border: "3px solid rgba(59,130,246,0.15)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        padding: "36px",
      }}>
        <div className="absolute top-0 left-[10%] right-[10%] h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

        <div className="flex items-center gap-7">

          {/* LEFT: Buttons */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[60px]">
            {[{ c: "#e84b5c" }, { c: "#3b82f6" }, { c: "#f6c453" }, { c: "#ff8a3d" }].map((b, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: "50%", backgroundColor: b.c,
                boxShadow: `0 0 10px ${b.c}66, inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)`,
                border: "1px solid rgba(0,0,0,0.2)",
              }} />
            ))}
          </div>

          {/* CENTER: Screen */}
          <div className="flex-1 relative" style={{
            background: "linear-gradient(180deg, #0a0f1e 0%, #0d1325 100%)",
            borderRadius: "12px", border: "3px solid rgba(255,255,255,0.06)", padding: "24px",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.2)", minHeight: "300px",
          }}>
            <div className="absolute inset-0 pointer-events-none rounded-[9px]" style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)"
            }} />

            <div className="relative flex gap-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div style={{ width: 80, height: 80, borderRadius: "8px", border: "2px solid #f59e0b", overflow: "hidden", boxShadow: "0 0 15px rgba(245,158,11,0.2)" }}>
                  {avatar ? (
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                      style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-[0.15em] block mb-1" style={{ color: "rgba(148,163,184,0.5)" }}>Display Name</span>
                  <span className="text-xl font-bold block truncate" style={{ color: "rgb(248 250 252)", ...hFont }}>{name}</span>
                  {profile.email && (
                    <span className="text-xs block mt-0.5" style={{ color: "rgba(148,163,184,0.6)" }}>{profile.email}</span>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(148,163,184,0.5)" }}>XP Level</span>
                    <span className="text-xs font-bold" style={{ color: "#f59e0b", ...hFont }}>LVL {level}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{
                      backgroundColor: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: "linear-gradient(90deg, #3b82f6, #60a5fa, #f59e0b)",
                          boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                        }} />
                    </div>
                    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: "rgba(245,158,11,0.6)" }}>
                      {xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] block mb-1" style={{ color: "rgba(148,163,184,0.5)" }}>Current Streak</span>
                    <div className="flex items-center gap-1.5">
                      <span>🔥</span>
                      <span className="text-lg font-bold" style={{ color: "#e84b5c" }}>{streak}</span>
                      <span className="text-xs" style={{ color: "rgba(232,75,92,0.6)" }}>day{streak !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] block mb-1" style={{ color: "rgba(148,163,184,0.5)" }}>Longest Streak</span>
                    <div className="flex items-center gap-1.5">
                      <span>🏆</span>
                      <span className="text-lg font-bold" style={{ color: "#f6c453" }}>{bestStreak}</span>
                      <span className="text-xs" style={{ color: "rgba(246,196,83,0.6)" }}>day{bestStreak !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(148,163,184,0.3)" }}>⚔️ Quest v1.0</span>
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(148,163,184,0.3)" }}>
                Member since {new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* RIGHT: D-Pad */}
          <div className="flex-shrink-0 w-[60px] flex items-center justify-center">
            <div className="relative" style={{ width: 60, height: 60 }}>
              <div className="absolute top-1/2 left-0 -translate-y-1/2" style={{
                width: 70, height: 24, backgroundColor: "#e84b5c", borderRadius: "5px",
                boxShadow: "0 0 16px rgba(232,75,92,0.35), inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.1)",
              }} />
              <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{
                width: 24, height: 70, backgroundColor: "#e84b5c", borderRadius: "5px",
                boxShadow: "0 0 16px rgba(232,75,92,0.35), inset 0 -3px 5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.1)",
              }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 px-4">
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
            <span className="text-[9px] uppercase tracking-[0.15em] font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>Power</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "rgba(245,158,11,0.4)", ...hFont }}>_Quest</span>
          <div className="flex gap-[3px]">{[...Array(5)].map((_, i) => (
            <div key={i} style={{ width: 2, height: 14, borderRadius: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          ))}</div>
        </div>
      </div>

      <div className="w-full max-w-[600px] h-[60px] mt-[-1px]"
        style={{ background: "radial-gradient(ellipse at center top, rgba(245,158,11,0.04) 0%, transparent 70%)" }} />
    </div>
  );
}