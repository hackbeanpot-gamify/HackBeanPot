/**
 * lib/security/verifyToken.ts
 *
 * Verifies an HMAC-signed confirmation token.
 *
 * WHY THIS EXISTS:
 * The /api/quest/confirm endpoint receives an assignment ID, user ID,
 * and a token from the URL. We recompute the HMAC and compare to
 * verify the link is authentic and hasn't been tampered with.
 *
 * Uses timing-safe comparison to prevent timing attacks.
 */

import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify a confirmation token against an assignment ID and user ID.
 *
 * @param assignmentId - UUID of the assignment (from URL query).
 * @param userId       - UUID of the user (from URL query).
 * @param token        - Hex-encoded HMAC token (from URL query).
 * @returns true if valid, false if invalid or missing secret.
 */
export function verifyConfirmToken(
  assignmentId: string,
  userId: string,
  token: string
): boolean {
  const secret = process.env.CRON_SECRET ?? process.env.CONFIRM_TOKEN_SECRET;
  if (!secret) {
    console.error("[verifyToken] Missing CRON_SECRET or CONFIRM_TOKEN_SECRET");
    return false;
  }

  const payload = `${assignmentId}:${userId}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  // Timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(token, "hex");

    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    // Invalid hex string
    return false;
  }
}
