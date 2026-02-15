/**
 * lib/quests/completeDailyQuest.ts
 *
 * Calls the Postgres RPC function `complete_daily_quest` to atomically
 * mark a quest as completed and update user stats (XP, streak, level).
 *
 * WHY THIS EXISTS:
 * All completion logic lives in the Postgres function for atomicity.
 * This TypeScript wrapper provides a clean API for route handlers
 * and the email confirmation endpoint.
 *
 * RPC: public.complete_daily_quest(p_user_id, p_assignment_id, p_proof_payload)
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/** Shape returned by the RPC on success. */
export interface CompleteQuestResult {
  success: boolean;
  error?: string;
  assignment_id?: string;
  quest_title?: string;
  xp_awarded?: number;
  xp_total?: number;
  level?: number;
  streak_current?: number;
  streak_best?: number;
  quests_completed_total?: number;
  completed_at?: string;
}

/**
 * Complete a daily quest assignment via the Postgres RPC function.
 *
 * This atomically:
 *   1. Validates the assignment belongs to the user and is "assigned"
 *   2. Sets status="completed", completed_at=now()
 *   3. Awards XP from dailyQuest.xp_reward
 *   4. Updates streak (consecutive days logic)
 *   5. Recomputes level = floor(xp_total / 500) + 1
 *   6. Returns updated stats
 *
 * @param userId        - UUID of the user completing the quest.
 * @param assignmentId  - UUID of the assignment row.
 * @param proofPayload  - Optional proof data (photo URL, reflection, etc.)
 * @returns CompleteQuestResult with success flag and updated stats.
 */
export async function completeDailyQuest(
  userId: string,
  assignmentId: string,
  proofPayload?: Record<string, unknown> | null
): Promise<CompleteQuestResult> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase.rpc("complete_daily_quest", {
    p_user_id: userId,
    p_assignment_id: assignmentId,
    p_proof_payload: proofPayload ?? null,
  });

  if (error) {
    console.error("[completeDailyQuest] RPC error:", error.message);
    return { success: false, error: error.message };
  }

  // The RPC returns a JSONB object
  return data as CompleteQuestResult;
}
