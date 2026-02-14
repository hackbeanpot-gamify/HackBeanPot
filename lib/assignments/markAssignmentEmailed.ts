/**
 * lib/assignments/markAssignmentEmailed.ts
 *
 * Sets `emailed_at` on an assignment after a successful email send.
 *
 * WHY THIS EXISTS:
 * Makes the job idempotent. If the job re-runs, assignments with
 * emailed_at != null are skipped. Email send and DB update are
 * separate concerns — this only runs after a confirmed send.
 *
 * TABLE: public.dailyQuestAssignment
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Mark an assignment as emailed by setting emailed_at = now().
 *
 * @param assignmentId - UUID of the assignment row.
 * @throws Error if the update fails.
 */
export async function markAssignmentEmailed(
  assignmentId: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("dailyQuestAssignment")
    .update({ emailed_at: new Date().toISOString() })
    .eq("id", assignmentId);

  if (error) {
    throw new Error(
      `[markAssignmentEmailed] Failed for id=${assignmentId}: ${error.message}`
    );
  }
}
