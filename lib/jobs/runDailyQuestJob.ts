/**
 * lib/jobs/runDailyQuestJob.ts
 *
 * Orchestrator: assigns one quest per user per day and emails it.
 *
 * WHY THIS EXISTS:
 * This is the "glue" that calls all single-responsibility functions.
 * It contains NO database queries and NO Resend calls directly —
 * it only orchestrates the flow.
 *
 * IDEMPOTENCY (safe to run multiple times per day):
 *   - Assignment exists?        → skip creation.
 *   - emailed_at already set?   → skip email.
 *   - One user fails?           → others still process.
 *
 * FLOW (per user):
 *   1. Check if assignment exists for today.
 *   2. If not → pick random quest → create assignment.
 *   3. If emailed_at is null → build email → send → mark emailed.
 *   4. If emailed_at is set → skip.
 */

import { getTodayDateYYYYMMDD } from "@/lib/date/getTodayDateYYYYMMDD";
import { getAllNotifiableUsers } from "@/lib/users/getAllNotifiableUsers";
import { getRandomActiveDailyQuest } from "@/lib/quests/getRandomActiveDailyQuest";
import { getAssignmentForUserOnDate } from "@/lib/assignments/getAssignmentForUserOnDate";
import { createAssignment } from "@/lib/assignments/createAssignment";
import { markAssignmentEmailed } from "@/lib/assignments/markAssignmentEmailed";
import { buildDailyQuestEmail } from "@/lib/email/buildDailyQuestEmail";
import { sendEmail } from "@/lib/email/sendEmail";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Quest, NotifiableUser } from "@/lib/quests/types";

/** Summary returned by the job for logging / API response. */
export interface DailyQuestJobResult {
  /** Date the job ran for. */
  date: string;
  /** Total users processed. */
  processed: number;
  /** New assignments created this run. */
  newlyAssigned: number;
  /** Emails successfully sent this run. */
  emailed: number;
  /** Skipped because email was already sent. */
  alreadyEmailed: number;
  /** Per-user errors (non-fatal). */
  errors: Array<{ userId: string; error: string }>;
}

/**
 * Fetch a quest by its UUID from public.dailyQuest.
 * Used when an assignment already existed and we need quest details for the email.
 */
async function getQuestById(questId: string): Promise<Quest | null> {
  const { data, error } = await supabaseAdmin
    .from("dailyQuest")
    .select("*")
    .eq("id", questId)
    .single();

  if (error) {
    console.error("[getQuestById] Failed:", error.message);
    return null;
  }

  return data as Quest;
}

/**
 * Run the daily quest assignment + email job.
 *
 * For every user in users_profile:
 *   1. Ensure they have a quest assigned for today.
 *   2. Send them an email if they haven't been emailed yet.
 *
 * @returns Summary of what happened.
 */
export async function runDailyQuestJob(): Promise<DailyQuestJobResult> {
  const today = getTodayDateYYYYMMDD();
  const users = await getAllNotifiableUsers();

  const result: DailyQuestJobResult = {
    date: today,
    processed: 0,
    newlyAssigned: 0,
    emailed: 0,
    alreadyEmailed: 0,
    errors: [],
  };

  console.log(`[DailyQuestJob] Starting for date=${today}, users=${users.length}`);

  for (const user of users) {
    result.processed++;

    try {
      await processOneUser(user, today, result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push({ userId: user.id, error: message });
      console.error(`[DailyQuestJob] Error for user=${user.id}:`, message);
    }
  }

  console.log(
    `[DailyQuestJob] Done. date=${today} processed=${result.processed} ` +
    `assigned=${result.newlyAssigned} emailed=${result.emailed} ` +
    `skipped=${result.alreadyEmailed} errors=${result.errors.length}`
  );

  return result;
}

/**
 * Process a single user: assign quest if needed, email if needed.
 * Extracted for readability — called once per user by runDailyQuestJob.
 */
async function processOneUser(
  user: NotifiableUser,
  today: string,
  result: DailyQuestJobResult
): Promise<void> {
  // ── Step 1: Check for existing assignment ──
  let assignment = await getAssignmentForUserOnDate(user.id, today);
  let quest: Quest | null = null;

  // ── Step 2: Create assignment if missing ──
  if (!assignment) {
    quest = await getRandomActiveDailyQuest();
    if (!quest) {
      result.errors.push({
        userId: user.id,
        error: "No active quests in the pool. Run the seed script.",
      });
      return;
    }

    assignment = await createAssignment(user.id, quest.id, today);
    result.newlyAssigned++;
    console.log(`[DailyQuestJob] Assigned "${quest.title}" → user=${user.id}`);
  }

  // ── Step 3: Skip if already emailed ──
  if (assignment.emailed_at) {
    result.alreadyEmailed++;
    return;
  }

  // ── Step 4: Fetch quest if we don't have it yet ──
  if (!quest) {
    quest = await getQuestById(assignment.quest_id);
    if (!quest) {
      result.errors.push({
        userId: user.id,
        error: `Quest not found: quest_id=${assignment.quest_id}`,
      });
      return;
    }
  }

  // ── Step 5: Build + send email ──
  const { subject, text } = buildDailyQuestEmail(quest, user);
  await sendEmail(user.email, subject, text);

  // ── Step 6: Mark as emailed (only after successful send) ──
  await markAssignmentEmailed(assignment.id);
  result.emailed++;
  console.log(`[DailyQuestJob] Emailed "${quest.title}" → ${user.email}`);
}
