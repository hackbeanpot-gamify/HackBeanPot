/**
 * lib/email/buildDailyQuestEmail.ts
 *
 * Builds the subject + plain-text body for a daily quest email.
 * Uses snake_case field names matching public.dailyQuest.
 */

import type { Quest, NotifiableUser } from "@/lib/quests/types";

const CATEGORY_EMOJI: Record<string, string> = {
  cleanup: "🧹",
  environment: "🌱",
  social: "👋",
  kindness: "💛",
  community: "🏘️",
  civic: "🏛️",
  volunteer: "🤝",
};

export interface DailyQuestEmailPayload {
  subject: string;
  text: string;
}

/**
 * Build email subject + plain-text body for a daily quest notification.
 *
 * @param quest - The Quest assigned to the user.
 * @param user  - The user receiving the email (for personalization).
 * @returns { subject, text } ready for sendEmail().
 */
export function buildDailyQuestEmail(
  quest: Quest,
  user: NotifiableUser
): DailyQuestEmailPayload {
  const name = user.display_name ?? "Quester";
  const emoji = CATEGORY_EMOJI[quest.category] ?? "🎯";
  const baseUrl = process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const subject = `🎯 Your daily quest: ${quest.title}`;

  const text = [
    `Hey ${name}! 👋`,
    ``,
    `Your daily Impact Trail quest is ready:`,
    ``,
    `${emoji}  ${quest.title}`,
    `${quest.description}`,
    ``,
    `⏱️  ~${quest.estimated_minutes} min  |  ⭐ +${quest.xp_reward} XP`,
    ``,
    `Open Impact Trail to complete it:`,
    `${baseUrl}/daily`,
    ``,
    `Keep your streak alive! 🔥`,
    `— The Impact Trail Team 🎢`,
  ].join("\n");

  return { subject, text };
}
