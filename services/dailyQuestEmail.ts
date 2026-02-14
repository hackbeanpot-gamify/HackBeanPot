/**
 * dailyQuestEmail.ts
 *
 * Orchestrator: fetches today's quest for a user,
 * builds the email, sends it via Resend, and logs the result.
 */

import { getTodaysQuestForUser, getQuestUser, getUsersWithPendingQuests } from "@/lib/quests/getTodaysQuest";
import { buildDailyQuestReminderEmail } from "@/email/templates/dailyQuestReminder";
import { sendEmail } from "@/lib/email/sendEmail";
import { createClient } from "@/lib/supabase/server";

interface SendResult {
  ok: boolean;
  reason?: string;
  emailId?: string;
}

/**
 * Log a notification attempt to the database.
 */
async function logNotification(entry: {
  user_id: string;
  quest_id: string | null;
  type: string;
  status: "sent" | "failed";
  error?: string;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("notification_logs").insert({
      ...entry,
      sent_at: new Date().toISOString(),
    });
  } catch (err) {
    // Don't throw on log failure — it's non-critical
    console.error("[logNotification] Failed to log:", err);
  }
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
  const payload = buildDailyQuestReminderEmail(quest, user.display_name || user.email);

  // 4. Send email
  try {
    await sendEmail(user.email, payload.subject, payload.text);

    // 5. Log success
    await logNotification({
      user_id: userId,
      quest_id: String(quest.id),
      type: "daily_quest_reminder",
      status: "sent",
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // 5. Log failure
    await logNotification({
      user_id: userId,
      quest_id: String(quest.id),
      type: "daily_quest_reminder",
      status: "failed",
      error: message,
    });

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
