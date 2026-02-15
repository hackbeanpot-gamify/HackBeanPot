/**
 * lib/raidBoss/getDailyQuestWithRsvps.ts
 *
 * Orchestrator for the Quests tab. Combines:
 *   1. Today's daily quest assignment (if any)
 *   2. Raid boss events the user has RSVP'd to
 *
 * Resolves the user by email so every call is self-contained.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getUserRsvps } from "./getUserRsvps";
import type { DailyQuest, RaidBossEvent } from "@/types";

/** Shape returned by this orchestrator */
export interface DailyQuestPageData {
  /** Today's assigned quest with its assignment ID, or null */
  dailyQuest: (DailyQuest & { assignmentId: string; assignmentStatus: string }) | null;
  /** Raid boss events the user has RSVP'd to (may be empty) */
  rsvpEvents: RaidBossEvent[];
  /** If the user could not be resolved, this will be a message */
  userError: string | null;
}

/**
 * Get today's date in YYYY-MM-DD format (America/New_York timezone).
 * Matches the format used by dailyQuestAssignment.assigned_date.
 */
function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

/**
 * Fetch everything the Quests tab needs for a given user ID.
 *
 * @param userId - User's UUID
 * @returns Daily quest (or null) + RSVP'd raid boss events
 */
export async function getDailyQuestWithRsvps(
  userId: string
): Promise<DailyQuestPageData> {

  const supabase = getSupabaseAdminClient();
  const today = getTodayDateString();

  // Step 2: get today's daily quest assignment (expect at most one)
  const { data: assignment, error: questErr } = await supabase
    .from("dailyQuestAssignment")
    .select("id, status, dailyQuest!inner(*)")
    .eq("user_id", userId)
    .eq("assigned_date", today)
    .in("status", ["assigned", "completed"])
    .limit(1)
    .maybeSingle();

  let dailyQuest: DailyQuestPageData["dailyQuest"] = null;

  if (questErr) {
    console.error("[getDailyQuestWithRsvps] Quest query failed:", questErr.message);
  } else if (assignment && assignment.dailyQuest) {
    dailyQuest = {
      ...(assignment.dailyQuest as unknown as DailyQuest),
      assignmentId: assignment.id as string,
      assignmentStatus: assignment.status as string,
    };
  }

  // Step 3: get RSVP'd raid boss events
  const rsvpEvents = await getUserRsvps(userId);

  return { dailyQuest, rsvpEvents, userError: null };
}
