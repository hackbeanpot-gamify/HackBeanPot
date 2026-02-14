/**
 * email/templates/dailyQuestReminder.ts
 *
 * Generates the HTML email template for daily quest notifications.
 * Uses snake_case field names matching public.dailyQuest.
 */

import type { Quest } from "@/lib/quests/types";

const CATEGORY_EMOJI: Record<string, string> = {
  cleanup: "🧹",
  environment: "🌱",
  social: "👋",
  kindness: "💛",
  community: "🏘️",
  civic: "🏛️",
  volunteer: "🤝",
};

/**
 * Build the HTML + plain-text email for a daily quest reminder.
 *
 * @param quest - The Quest object assigned to the user.
 * @param userName - The user's display name (for greeting).
 * @returns { subject, text, html }
 */
export function buildDailyQuestReminderEmail(
  quest: Quest,
  userName?: string
): { subject: string; text: string; html: string } {
  const name = userName ?? "Quester";
  const emoji = CATEGORY_EMOJI[quest.category] ?? "🎯";
  const xp = quest.xp_reward ?? 0;
  const mins = quest.estimated_minutes ?? 5;
  const ctaUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/daily`;

  const subject = `🎯 Your daily quest: ${quest.title}`;

  const text = [
    `Hey ${name}!`,
    ``,
    `${emoji} ${quest.title}`,
    `${quest.description}`,
    ``,
    `Category: ${quest.category ?? "general"} | XP: +${xp} | ~${mins} min`,
    ``,
    `Complete it here: ${ctaUrl}`,
    ``,
    `Keep your streak alive! 🔥`,
    `— Impact Trail 🎢`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <p style="color:#f8fafc;font-size:24px;font-weight:800;margin:0;">🎢 Impact Trail</p>
      <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Your daily quest is ready!</p>
    </div>

    <!-- Quest Card -->
    <div style="background:#1e293b;border-radius:16px;padding:24px;border:1px solid #334155;">
      <!-- Category Badge -->
      <div style="margin-bottom:12px;">
        <span style="background:#334155;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:99px;">
          ${emoji} ${quest.category}
        </span>
      </div>

      <!-- Title -->
      <h2 style="color:#f8fafc;font-size:20px;font-weight:700;margin:0 0 8px;">${quest.title}</h2>

      <!-- Description -->
      <p style="color:#94a3b8;font-size:14px;line-height:1.5;margin:0 0 16px;">${quest.description}</p>

      <!-- XP + Time -->
      <div style="display:flex;gap:24px;margin-bottom:20px;">
        <div>
          <p style="color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0;">XP Reward</p>
          <p style="color:#f59e0b;font-size:22px;font-weight:800;margin:2px 0 0;">+${xp}</p>
        </div>
        <div>
          <p style="color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0;">Time</p>
          <p style="color:#f8fafc;font-size:22px;font-weight:800;margin:2px 0 0;">~${mins}m</p>
        </div>
      </div>

      <!-- CTA Button -->
      <a href="${ctaUrl}" style="display:block;text-align:center;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:700;padding:14px 0;border-radius:12px;text-decoration:none;">
        Complete Quest →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;margin:0;">Keep your streak alive! 🔥</p>
    </div>
  </div>
</body>
</html>`.trim();

  return { subject, text, html };
}
