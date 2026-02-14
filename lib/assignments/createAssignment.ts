/**
 * lib/assignments/createAssignment.ts
 *
 * Inserts a new daily quest assignment for a user.
 *
 * TABLE: public.dailyQuestAssignment
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Assignment } from "@/lib/quests/types";

/**
 * Insert a new quest assignment.
 *
 * @param userId  - The user's UUID (from users_profile.id).
 * @param questId - The quest's UUID (from dailyQuest.id).
 * @param date    - Assignment date, "YYYY-MM-DD" format.
 * @returns The newly created Assignment row.
 * @throws Error on insert failure (e.g., duplicate constraint).
 */
export async function createAssignment(
  userId: string,
  questId: string,
  date: string
): Promise<Assignment> {
  const { data, error } = await supabaseAdmin
    .from("dailyQuestAssignment")
    .insert({
      user_id: userId,
      quest_id: questId,
      assigned_date: date,
      status: "assigned",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `[createAssignment] Failed for user=${userId} date=${date}: ${error.message}`
    );
  }

  return data as Assignment;
}
