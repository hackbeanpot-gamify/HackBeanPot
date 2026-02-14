/**
 * lib/assignments/getAssignmentForUserOnDate.ts
 *
 * Checks if a user already has a quest assignment for a given date.
 *
 * WHY THIS EXISTS:
 * The daily quest job must be idempotent. Running it twice should not
 * create duplicate assignments. This function checks "does this user
 * already have an assignment today?" before creating one.
 *
 * TABLE: public.dailyQuestAssignment
 *   Unique constraint on (user_id, assigned_date) guarantees one per day.
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Assignment } from "@/lib/quests/types";

/**
 * Look up an existing assignment for a user on a specific date.
 *
 * @param userId - The user's UUID (from users_profile.id).
 * @param date   - Date to check, "YYYY-MM-DD" format.
 * @returns The Assignment row if found, or null.
 */
export async function getAssignmentForUserOnDate(
  userId: string,
  date: string
): Promise<Assignment | null> {
  const { data, error } = await supabaseAdmin
    .from("dailyQuestAssignment")
    .select("*")
    .eq("user_id", userId)
    .eq("assigned_date", date)
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[getAssignmentForUserOnDate] Query failed:", error.message);
    return null;
  }

  return data as Assignment;
}
