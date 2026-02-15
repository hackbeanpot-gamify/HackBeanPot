/**
 * app/api/quest/confirm/route.ts
 *
 * One-click quest completion endpoint.
 *
 * HOW IT WORKS:
 * The daily quest email includes a link like:
 *   /api/quest/confirm?id=<assignmentId>&uid=<userId>&token=<hmac>
 *
 * When clicked:
 *   1. Verify the HMAC token (proves the link is authentic).
 *   2. Call the complete_daily_quest RPC (marks completed, awards XP).
 *   3. Redirect to /daily/confirmed with results in query params.
 *
 * SECURITY:
 *   - Token is an HMAC-SHA256 of (assignmentId + userId) using CRON_SECRET.
 *   - Cannot be forged without knowing the secret.
 *   - Each token is specific to one assignment + user combo.
 *
 * IDEMPOTENCY:
 *   - If the quest is already completed, the RPC returns success=false
 *     with an error message. We still redirect to the confirmed page
 *     with an "already completed" message.
 */

import { NextResponse } from "next/server";
import { verifyConfirmToken } from "@/lib/security/verifyToken";
import { completeDailyQuest } from "@/lib/quests/completeDailyQuest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("id");
  const userId = searchParams.get("uid");
  const token = searchParams.get("token");

  const baseUrl =
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  // ── Validate params ──
  if (!assignmentId || !userId || !token) {
    return NextResponse.redirect(
      `${baseUrl}/daily/confirmed?error=missing_params`
    );
  }

  // ── Verify HMAC token ──
  const isValid = verifyConfirmToken(assignmentId, userId, token);
  if (!isValid) {
    return NextResponse.redirect(
      `${baseUrl}/daily/confirmed?error=invalid_token`
    );
  }

  // ── Complete the quest via RPC ──
  const result = await completeDailyQuest(userId, assignmentId);

  if (!result.success) {
    // Quest already completed or other validation error
    const errorMsg = encodeURIComponent(result.error ?? "unknown_error");
    return NextResponse.redirect(
      `${baseUrl}/daily/confirmed?error=${errorMsg}`
    );
  }

  // ── Redirect to success page with stats ──
  const params = new URLSearchParams({
    success: "true",
    quest: result.quest_title ?? "",
    xp: String(result.xp_awarded ?? 0),
    xpTotal: String(result.xp_total ?? 0),
    level: String(result.level ?? 1),
    streak: String(result.streak_current ?? 0),
  });

  return NextResponse.redirect(`${baseUrl}/daily/confirmed?${params}`);
}
