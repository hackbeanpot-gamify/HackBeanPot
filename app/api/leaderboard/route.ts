// API: GET /api/leaderboard — city-wide leaderboard from user_stats + users_profile
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Fetch user stats ordered by XP
  const { data: stats, error: statsError } = await supabase
    .from("user_stats")
    .select("user_id, xp_total, level, streak_current, quests_completed_total")
    .order("xp_total", { ascending: false })
    .limit(50);

  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  if (!stats || stats.length === 0) {
    return NextResponse.json([]);
  }

  // Fetch display names for all users in the leaderboard
  const userIds = stats.map((s) => s.user_id);
  const { data: profiles } = await supabase
    .from("users_profile")
    .select("id, display_name")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, p.display_name])
  );

  // Merge stats with display names
  const leaderboard = stats.map((s) => ({
    user_id: s.user_id,
    display_name: profileMap.get(s.user_id) || "Anonymous",
    xp_total: s.xp_total,
    level: s.level,
    streak_current: s.streak_current,
    quests_completed_total: s.quests_completed_total,
  }));

  return NextResponse.json(leaderboard);
}
