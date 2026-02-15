/**
 * lib/assignments/getTodaysAssignmentsNeedingEmail.ts
 *
 * Fetches all assignments for a given date where emailed_at is null,
 * joined with the user's email and full quest details.
 *
 * WHY THIS EXISTS:
 * The email job needs to know: "which assignments exist today that
 * haven't been emailed yet?" This single query gets everything
 * needed to build and send the email in one round-trip.
 *
 * TABLES:
 *   public.dailyQuestAssignment  — assignments
 *   public.dailyQuest            — quest details (joined via quest_id FK)
 *   public.profiles             — user email (joined via user_id FK)
 *
 * IDEMPOTENCY:
 *   Only returns rows where emailed_at IS NULL. If the job runs again,
 *   already-emailed assignments are excluded automatically.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/** Shape of one row returned by this query. */
export interface AssignmentNeedingEmail {
  /** Assignment UUID */
  id: string;
  /** User UUID */
  user_id: string;
  /** Quest UUID */
  quest_id: string;
  /** "YYYY-MM-DD" */
  assigned_date: string;
  /** Assignment status */
  status: string;
  /** Null = not yet emailed (the whole point of this query) */
  emailed_at: string | null;

  /** Joined from profiles */
  profiles: {
    email: string;
    display_name: string | null;
  } | null;

  /** Joined from dailyQuest */
  dailyQuest: {
    id: string;
    title: string;
    description: string;
    category: string;
    xp_reward: number;
    estimated_minutes: number;
    proof_type: string;
  } | null;
}

/**
 * Fetch all assignments for `today` that have NOT been emailed yet,
 * joined with user email and quest details.
 *
 * @param today - Date string in "YYYY-MM-DD" format.
 * @returns Array of assignments with joined user + quest data.
 *          Empty array on error (logs the error, never throws).
 */
export async function getTodaysAssignmentsNeedingEmail(
  today: string
): Promise<AssignmentNeedingEmail[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("dailyQuestAssignment")
    .select(
      `
      id,
      user_id,
      quest_id,
      assigned_date,
      status,
      emailed_at,
      profiles!user_id ( email, display_name ),
      dailyQuest!quest_id ( id, title, description, category, xp_reward, estimated_minutes, proof_type )
    `
    )
    .eq("assigned_date", today)
    .is("emailed_at", null);

  if (error) {
    console.error(
      "[getTodaysAssignmentsNeedingEmail] Query failed:",
      error.message
    );
    return [];
  }

  return (data ?? []) as unknown as AssignmentNeedingEmail[];
}
