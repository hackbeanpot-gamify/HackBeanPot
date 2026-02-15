/**
 * email/notifications.ts
 *
 * High-level notification helpers.
 */

import { sendEmail } from "@/lib/email/sendEmail";

/**
 * Send a generic daily quest reminder to a user.
 */
export async function sendDailyQuestNotification(user: { email: string; name?: string | null }) {
  return sendEmail({
    to: user.email,
    subject: "🎯 Your daily quest is waiting!",
    text: `Hey ${user.name ?? "Quester"}!\n\nYou have a new daily quest ready. Complete it to keep your streak alive and earn XP!\n\nOpen Impact Trail to get started 🎢`,
  });
}

/** Alias for backward compatibility. */
export const sendDailyQuestReminder = sendDailyQuestNotification;

/**
 * Send a streak warning email.
 */
export async function sendStreakWarning(user: { email: string; name?: string | null }, streak: number) {
  return sendEmail({
    to: user.email,
    subject: "🔥 Your streak is at risk!",
    text: `Hey ${user.name ?? "Quester"}!\n\nYour ${streak}-day streak is about to expire! Complete today's quest to keep it alive.\n\n— Impact Trail 🎢`,
  });
}

/**
 * Send an XP milestone email.
 */
export async function sendXpMilestone(user: { email: string; name?: string | null }, xp: number, level: number) {
  return sendEmail({
    to: user.email,
    subject: `⭐ You hit ${xp.toLocaleString()} XP!`,
    text: `Hey ${user.name ?? "Quester"}!\n\nCongrats! You've reached ${xp.toLocaleString()} XP and Level ${level}! Keep up the amazing work.\n\n— Impact Trail 🎢`,
  });
}
