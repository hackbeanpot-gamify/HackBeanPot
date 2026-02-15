/**
 * lib/email/resendClient.ts
 *
 * Returns a configured Resend client for sending transactional emails.
 *
 * WHY THIS EXISTS:
 * Single source of truth for Resend initialization. Every email-sending
 * function calls getResendClient() instead of constructing its own.
 * If we switch email providers, only this file changes.
 *
 * ENV VARS:
 *   RESEND_API_KEY — your Resend API key
 */

import { Resend } from "resend";

let _client: Resend | null = null;

/**
 * Get a configured Resend client.
 * Singleton — only one client is created per process.
 *
 * @returns Resend client instance.
 * @throws Error if RESEND_API_KEY is not set.
 */
export function getResendClient(): Resend {
  if (_client) return _client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("[resendClient] Missing RESEND_API_KEY env var.");

  _client = new Resend(apiKey);
  return _client;
}
