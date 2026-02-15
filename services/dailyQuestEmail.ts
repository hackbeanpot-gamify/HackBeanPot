/**
 * dailyQuestEmail.ts
 *
 * Orchestrator: fetches today's quest for a user,
 * builds the email, sends it via Resend, and logs the result.
 */

import { getTodaysQuestForUser, getQuestUser, getUsersWithPendingQuests } from "@/lib/quests/getTodaysQuest";
import { buildDailyQuestEmail } from "@/lib/email/buildDailyQuestEmail";
import { sendEmail } from "@/lib/email/sendEmail";

interface SendResult {
  ok: boolean;
  reason?: string;
}

/**
 * Send daily quest email to a single user.
 *
 * Flow: DB → build email → send → log
 */
export async function sendDailyQuestEmail(userId: string): Promise<SendResult> {
  // 1. Get today's quest
  const questResult = await getTodaysQuestForUser(userId);
  if (!questResult) {
    return { ok: false, reason: "no_quest_today" };
  }

  // 2. Get user info
  const user = await getQuestUser(userId);
  if (!user || !user.email) {
    return { ok: false, reason: "user_not_found_or_no_email" };
  }

  // 3. Build email
  const { quest } = questResult;
  const { subject, text, html } = buildDailyQuestEmail(quest, user.display_name || user.email);

  // 4. Send email
  try {
    await sendEmail({ to: user.email, subject, text, html });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[sendDailyQuestEmail] Failed for user=${userId}:`, message);
    return { ok: false, reason: message };
  }
}

/**
 * Send daily quest emails to ALL users with pending quests today.
 * Includes rate-limit delays for Resend free tier (2 req/sec).
 */
export async function sendAllDailyQuestEmails(): Promise<{
  sent: number;
  failed: number;
  skipped: number;
  results: { userId: string; result: SendResult }[];
}> {
  const userIds = await getUsersWithPendingQuests();

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const results: { userId: string; result: SendResult }[] = [];

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];

    const result = await sendDailyQuestEmail(userId);
    results.push({ userId, result });

    if (result.ok) {
      sent++;
    } else if (result.reason === "no_quest_today" || result.reason === "user_not_found_or_no_email") {
      skipped++;
    } else {
      failed++;
    }

    // Rate limit: wait 1.5s between sends (Resend free tier = 2 req/sec)
    if (i < userIds.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return { sent, failed, skipped, results };
}
