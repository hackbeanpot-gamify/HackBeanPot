/**
 * lib/email/buildDailyQuestEmail.ts
 *
 * Builds subject + text + HTML for a daily quest notification email.
 *
 * WHY THIS EXISTS:
 * Separates email content from email transport. Change wording or
 * design here without touching the send logic.
 */

import { buildConfirmUrl } from "@/lib/security/signToken";

/** Input shape — only the fields we need from the quest. */
export interface QuestEmailInput {
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  estimated_minutes: number;
}

/** Output shape — ready to pass to sendEmail(). */
export interface QuestEmailOutput {
  subject: string;
  text: string;
  html: string;
}

/** Optional context for generating confirmation links. */
export interface QuestEmailContext {
  assignmentId?: string;
  userId?: string;
}

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
 * Build the email content for a daily quest notification.
 *
 * @param quest    - Quest details (title, description, xp_reward, etc.)
 * @param userName - Display name for the greeting. Falls back to "Quester".
 * @param context  - Optional assignment/user IDs for generating confirm link.
 * @returns { subject, text, html } ready for sendEmail().
 */
export function buildDailyQuestEmail(
  quest: QuestEmailInput,
  userName?: string | null,
  context?: QuestEmailContext
): QuestEmailOutput {
  const name = userName ?? "Quester";
  const emoji = CATEGORY_EMOJI[quest.category] ?? "🎯";
  const baseUrl =
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";
  const ctaUrl = `${baseUrl}/daily`;

  // Build one-click confirm URL if we have assignment + user IDs
  const confirmUrl =
    context?.assignmentId && context?.userId
      ? buildConfirmUrl(context.assignmentId, context.userId)
      : null;

  const subject = `🎢 Your Daily Quest: ${quest.title}`;

  // ── Plain text version ──
  const textLines = [
    `Hey ${name}! 👋`,
    ``,
    `Your daily Impact Trail quest is ready:`,
    ``,
    `${emoji}  ${quest.title}`,
    `${quest.description}`,
    ``,
    `⏱️  ~${quest.estimated_minutes} min  |  ⭐ +${quest.xp_reward} XP`,
    ``,
  ];

  if (confirmUrl) {
    textLines.push(`✅ Mark as done (one click): ${confirmUrl}`);
    textLines.push(``);
  }

  textLines.push(
    `View your quest: ${ctaUrl}`,
    ``,
    `Keep your streak alive! 🔥`,
    `— The Impact Trail Team 🎢`
  );

  const text = textLines.join("\n");

  // ── HTML version ──
  const confirmButton = confirmUrl
    ? `<a href="${confirmUrl}" style="display:block;text-align:center;background:#16a34a;color:#ffffff;font-size:15px;font-weight:700;padding:14px 0;border-radius:12px;text-decoration:none;margin-bottom:10px;">
        ✅ Mark Complete (One Click)
      </a>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="color:#f8fafc;font-size:24px;font-weight:800;margin:0;">🎢 Impact Trail</p>
      <p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Hey ${name}, your daily quest is ready!</p>
    </div>
    <div style="background:#1e293b;border-radius:16px;padding:24px;border:1px solid #334155;">
      <div style="margin-bottom:12px;">
        <span style="background:#334155;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:99px;">
          ${emoji} ${quest.category}
        </span>
      </div>
      <h2 style="color:#f8fafc;font-size:20px;font-weight:700;margin:0 0 8px;">${quest.title}</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.5;margin:0 0 16px;">${quest.description}</p>
      <div style="margin-bottom:20px;">
        <span style="color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:1px;">XP Reward</span>
        <span style="color:#f59e0b;font-size:20px;font-weight:800;margin-left:6px;">+${quest.xp_reward}</span>
        <span style="color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-left:24px;">Time</span>
        <span style="color:#f8fafc;font-size:20px;font-weight:800;margin-left:6px;">~${quest.estimated_minutes}m</span>
      </div>
      ${confirmButton}
      <a href="${ctaUrl}" style="display:block;text-align:center;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:700;padding:14px 0;border-radius:12px;text-decoration:none;">
        View Quest Details →
      </a>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;margin:0;">Keep your streak alive! 🔥</p>
    </div>
  </div>
</body>
</html>`.trim();

  return { subject, text, html };
}
