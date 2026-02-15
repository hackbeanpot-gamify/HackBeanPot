/**
 * lib/security/signToken.ts
 *
 * Creates an HMAC-signed token for email confirmation links.
 *
 * WHY THIS EXISTS:
 * When we email a user their daily quest, the email includes a
 * "Complete Quest" link. That link contains an assignment ID and
 * a token. The token proves the link wasn't forged — only our
 * server can generate valid tokens because it knows CRON_SECRET.
 *
 * TOKEN FORMAT:
 *   HMAC-SHA256( assignmentId + ":" + userId, secret )
 *   Encoded as hex string.
 *
 * VERIFICATION:
 *   Recompute the HMAC and compare. See verifyToken.ts.
 *
 * SECRET:
 *   Uses CRON_SECRET env var. In production, use a dedicated
 *   CONFIRM_TOKEN_SECRET for separation of concerns.
 */

import { createHmac } from "crypto";

/**
 * Generate a signed confirmation token for a quest assignment.
 *
 * @param assignmentId - UUID of the assignment.
 * @param userId       - UUID of the user.
 * @returns Hex-encoded HMAC signature.
 * @throws Error if no secret is configured.
 */
export function signConfirmToken(
  assignmentId: string,
  userId: string
): string {
  const secret = process.env.CRON_SECRET ?? process.env.CONFIRM_TOKEN_SECRET;
  if (!secret) {
    throw new Error("[signToken] Missing CRON_SECRET or CONFIRM_TOKEN_SECRET");
  }

  const payload = `${assignmentId}:${userId}`;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Build the full confirmation URL for an email.
 *
 * @param assignmentId - UUID of the assignment.
 * @param userId       - UUID of the user.
 * @returns Full URL like https://app.com/api/quest/confirm?id=xxx&token=yyy
 */
export function buildConfirmUrl(
  assignmentId: string,
  userId: string
): string {
  const baseUrl =
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const token = signConfirmToken(assignmentId, userId);

  return `${baseUrl}/api/quest/confirm?id=${assignmentId}&uid=${userId}&token=${token}`;
}
