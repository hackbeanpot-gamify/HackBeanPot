"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// =============================================
// Types
// =============================================

interface Profile {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  city: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  streakLastDate: string | null;
  createdAt: string;
}

// =============================================
// XP Scaling Formula
// Each level costs more: Level 2 = 500, Level 3 = 1000, Level 4 = 1500...
// Cumulative: xpForLevel(L) = 250 * L * (L - 1)
//
// Level 1:  0 XP       Level 7:  10,500 XP
// Level 2:  500 XP     Level 8:  14,000 XP
// Level 3:  1,500 XP   Level 9:  18,000 XP
// Level 4:  3,000 XP   Level 10: 22,500 XP
// Level 5:  5,000 XP   Level 11: 27,500 XP
// Level 6:  7,500 XP   Level 12: 33,000 XP
// =============================================

function xpForLevel(level: number): number {
  return 250 * level * (level - 1);
}

// =============================================
// Hook: useProfile
// =============================================

function useProfile(userId: number) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (dbError) throw dbError;
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

// =============================================
// Components
// =============================================

function XpBar({ xp, level }: { xp: number; level: number }) {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progress = Math.min(Math.max((xpInLevel / xpNeeded) * 100, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
          Level {level}
        </span>
        <span className="text-xs" style={{ color: "rgb(148 163 184)" }}>
          {xp.toLocaleString()} XP total
        </span>
      </div>
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #f59e0b, #f6c453)",
            boxShadow: "0 0 12px rgba(245, 158, 11, 0.4)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs" style={{ color: "rgba(245, 158, 11, 0.5)" }}>
          {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP to Level {level + 1}
        </span>
        <span className="text-xs" style={{ color: "rgba(148, 163, 184, 0.5)" }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.03]"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        border: `1px solid ${accent}40`,
        boxShadow: `0 0 20px ${accent}10`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <span className="text-xs uppercase tracking-widest" style={{ color: "rgb(148 163 184)" }}>
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold" style={{ color: accent }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

function StreakFlame({ streak }: { streak: number }) {
  if (streak === 0) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(148, 163, 184, 0.1)",
            border: "2px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.6rem", opacity: 0.4 }}>🔥</span>
        </div>
        <div>
          <div className="text-lg font-semibold" style={{ color: "rgb(148 163 184)" }}>
            No Active Streak
          </div>
          <div className="text-xs" style={{ color: "rgba(148, 163, 184, 0.6)" }}>
            Complete a quest to start your streak!
          </div>
        </div>
      </div>
    );
  }

  const intensity = Math.min(streak / 30, 1);
  const glowOpacity = 0.15 + intensity * 0.25;
  const borderOpacity = 0.3 + intensity * 0.4;

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `rgba(232, 75, 92, ${glowOpacity})`,
          border: `2px solid rgba(232, 75, 92, ${borderOpacity})`,
          boxShadow: streak >= 7 ? "0 0 20px rgba(232, 75, 92, 0.2)" : "none",
        }}
      >
        <span style={{ fontSize: "2rem" }}>🔥</span>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" style={{ color: "#e84b5c" }}>
            {streak}
          </span>
          <span className="text-sm font-medium" style={{ color: "rgba(232, 75, 92, 0.7)" }}>
            day{streak !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-xs" style={{ color: "rgb(148 163 184)" }}>
          {streak >= 30
            ? "Legendary streak! 🏆"
            : streak >= 14
            ? "On fire! Keep it going! 💪"
            : streak >= 7
            ? "One week strong!"
            : "Building momentum..."}
        </div>
      </div>
    </div>
  );
}

// =============================================
// Profile Page
// =============================================

export default function ProfilePage() {
  // Hardcoded to user 4 (Emma Watson, Boston) for demo
  const DEMO_USER_ID = 4;

  const { profile, loading, error } = useProfile(DEMO_USER_ID);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0B1120" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#f59e0b", borderTopColor: "transparent" }}
          />
          <span className="text-sm" style={{ color: "rgb(148 163 184)" }}>
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0B1120" }}
      >
        <div
          className="rounded-xl p-8 text-center max-w-sm"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(232, 75, 92, 0.4)",
          }}
        >
          <span className="text-4xl block mb-3">😔</span>
          <span className="text-sm" style={{ color: "#e84b5c" }}>
            {error || "Profile not found"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #080E1A 0%, #0B1120 40%, #0E1528 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* ===== HEADER: Avatar + Name ===== */}
        <div className="flex flex-col items-center mb-10">
          {/* Avatar */}
          <div className="relative mb-6" style={{ width: 128, height: 128 }}>
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #e84b5c, #ff8a3d, #f6c453)",
                padding: 3,
                borderRadius: "50%",
              }}
            />
            {/* Inner avatar */}
            <div
              className="absolute inset-[3px] rounded-full overflow-hidden"
              style={{ backgroundColor: "#0f172a" }}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ color: "#f59e0b" }}
                >
                  {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Level badge */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f6c453)",
                color: "#0B1120",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
              }}
            >
              LVL {profile.level}
            </div>
          </div>

          {/* Display name */}
          <h1
            className="text-4xl font-bold mb-1 tracking-tight"
            style={{ color: "rgb(248 250 252)" }}
          >
            {profile.displayName || profile.username}
          </h1>

          {/* Username + City pills */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-sm px-2.5 py-0.5 rounded-full"
              style={{
                color: "rgb(148 163 184)",
                backgroundColor: "rgba(148, 163, 184, 0.1)",
              }}
            >
              @{profile.username}
            </span>
            {profile.city && (
              <span
                className="text-sm px-2.5 py-0.5 rounded-full"
                style={{
                  color: "rgb(148 163 184)",
                  backgroundColor: "rgba(148, 163, 184, 0.1)",
                }}
              >
                📍 {profile.city}
              </span>
            )}
          </div>
        </div>

        {/* ===== XP BAR ===== */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
          }}
        >
          <XpBar xp={profile.xp} level={profile.level} />
        </div>

        {/* ===== STREAK ===== */}
        <div
          className="rounded-xl p-5 mb-5"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `1px solid rgba(232, 75, 92, ${profile.currentStreak > 0 ? "0.25" : "0.15"})`,
          }}
        >
          <StreakFlame streak={profile.currentStreak} />
        </div>

        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <StatCard label="Total XP" value={profile.xp} icon="⚡" accent="#f59e0b" />
          <StatCard label="Level" value={profile.level} icon="🎯" accent="#ff8a3d" />
          <StatCard label="Current Streak" value={profile.currentStreak} icon="🔥" accent="#e84b5c" />
          <StatCard label="Best Streak" value={profile.longestStreak} icon="🏆" accent="#f6c453" />
        </div>

        {/* ===== MEMBER SINCE ===== */}
        <div
          className="text-center pt-6"
          style={{ borderTop: "1px solid rgba(100, 116, 139, 0.15)" }}
        >
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "rgba(148, 163, 184, 0.4)" }}
          >
            ⚔️ Quest member since{" "}
            {new Date(profile.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}