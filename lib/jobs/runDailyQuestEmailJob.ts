/**
 * lib/jobs/runDailyQuestEmailJob.ts
 *
 * Orchestrates the daily quest email delivery.
 *
 * WHY THIS EXISTS:
 * This is pure glue — it calls single-purpose helpers in sequence.
 * Contains NO database queries, NO email formatting, NO Resend calls.
 *
 * FLOW:
 *   1. Get today's date.
 *   2. Fetch all assignments for today where emailed_at IS NULL
 *      (joined with user email + quest details).
 *   3. For each assignment:
 *      a. Skip if user has no email or quest join is missing.
 *      b. Build the email content.
 *      c. Send the email.
 *      d. Mark the assignment as emailed (only after successful send).
 *   4. Return summary stats.
 *
 * IDEMPOTENCY:
 *   - Only fetches assignments where emailed_at IS NULL.
 *   - Never marks emailed if the send fails.
 *   - Safe to run multiple times per day.
 *
 * RATE LIMITING:
 *   Resend free tier = 2 req/sec. We add a 600ms delay between sends.
 */

import { getTodayDateYYYYMMDD } from "@/lib/date/getTodayDateYYYYMMDD";
import { getTodaysAssignmentsNeedingEmail } from "@/lib/assignments/getTodaysAssignmentsNeedingEmail";
import { buildDailyQuestEmail } from "@/lib/email/buildDailyQuestEmail";
import { sendEmail } from "@/lib/email/sendEmail";
import { markAssignmentEmailed } from "@/lib/assignments/markAssignmentEmailed";

/** Summary returned by the job. */
export interface DailyQuestEmailJobResult {
  /** Date the job ran for */
  date: string;
  /** Total assignments attempted */
  attempted: number;
  /** Emails successfully sent */
  sent: number;
  /** Skipped because emailed_at was already set (shouldn't happen due to query filter) */
  skippedAlreadyEmailed: number;
  /** Skipped because user had no email */
  skippedMissingEmail: number;
  /** Skipped because quest join data was missing */
  skippedMissingQuest: number;
  /** Per-assignment errors */
  failures: Array<{ assignmentId: string; error: string }>;
}

/**
 * Run the daily quest email delivery job.
 *
 * Fetches all un-emailed assignments for today, sends emails,
 * and marks each assignment as emailed after successful send.
 *
 * @returns Summary of what happened.
 */
export async function runDailyQuestEmailJob(): Promise<DailyQuestEmailJobResult> {
  const today = getTodayDateYYYYMMDD();

  const result: DailyQuestEmailJobResult = {
    date: today,
    attempted: 0,
    sent: 0,
    skippedAlreadyEmailed: 0,
    skippedMissingEmail: 0,
    skippedMissingQuest: 0,
    failures: [],
  };

  // ── Step 1: Fetch all assignments needing email ──
  const assignments = await getTodaysAssignmentsNeedingEmail(today);

  console.log(
    `[DailyQuestEmailJob] date=${today} assignments_to_email=${assignments.length}`
  );

  if (assignments.length === 0) {
    console.log("[DailyQuestEmailJob] Nothing to email. Done.");
    return result;
  }

  // ── Step 2: Process each assignment ──
  for (let i = 0; i < assignments.length; i++) {
    const assignment = assignments[i];
    result.attempted++;

    // ── Guard: missing user email ──
    if (!assignment.profiles?.email) {
      result.skippedMissingEmail++;
      console.warn(
        `[DailyQuestEmailJob] Skipped assignment=${assignment.id}: no user email`
      );
      continue;
    }

    // ── Guard: missing quest data ──
    if (!assignment.dailyQuest) {
      result.skippedMissingQuest++;
      console.warn(
        `[DailyQuestEmailJob] Skipped assignment=${assignment.id}: quest join missing`
      );
      continue;
    }

    // ── Guard: already emailed (shouldn't happen, but defensive) ──
    if (assignment.emailed_at) {
      result.skippedAlreadyEmailed++;
      continue;
    }

    try {
      // ── Build email ──
      const { subject, text, html } = buildDailyQuestEmail(
        assignment.dailyQuest,
        assignment.profiles.display_name,
        { assignmentId: assignment.id, userId: assignment.user_id }
      );

      // ── Send email ──
      await sendEmail({
        to: assignment.profiles.email,
        subject,
        text,
        html,
      });

      // ── Mark as emailed (only after successful send) ──
      await markAssignmentEmailed(assignment.id);

      result.sent++;
      console.log(
        `[DailyQuestEmailJob] ✅ Sent "${assignment.dailyQuest.title}" → ${assignment.profiles.email}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.failures.push({ assignmentId: assignment.id, error: message });
      console.error(
        `[DailyQuestEmailJob] ❌ Failed assignment=${assignment.id}: ${message}`
      );
    }

    // ── Rate limit: 600ms between sends (Resend free tier) ──
    if (i < assignments.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  // ── Summary ──
  console.log(
    `[DailyQuestEmailJob] Done. attempted=${result.attempted} sent=${result.sent} ` +
      `skippedEmail=${result.skippedMissingEmail} skippedQuest=${result.skippedMissingQuest} ` +
      `failures=${result.failures.length}`
  );

  return result;
}
