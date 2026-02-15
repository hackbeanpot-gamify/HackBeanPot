/**
 * lib/assignments/markAssignmentEmailed.ts
 *
 * Sets emailed_at = now() on an assignment row.
 *
 * WHY THIS EXISTS:
 * Called ONLY after a successful email send. This makes the job
 * idempotent — re-running the job skips assignments where
 * emailed_at is already set.
 *
 * TABLE: public.dailyQuestAssignment
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/**
 * Mark an assignment as emailed by setting emailed_at to now().
 *
 * @param assignmentId - UUID of the assignment row.
 * @throws Error if the update fails.
 */
export async function markAssignmentEmailed(
  assignmentId: string
): Promise<void> {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("dailyQuestAssignment")
    .update({ emailed_at: new Date().toISOString() })
    .eq("id", assignmentId);

  if (error) {
    throw new Error(
      `[markAssignmentEmailed] Failed for id=${assignmentId}: ${error.message}`
    );
  }
}
