/**
 * lib/email/sendEmail.ts
 *
 * Sends a single email via the Resend API.
 *
 * WHY THIS EXISTS:
 * This is the ONLY file that knows about Resend. If we switch providers,
 * only this file changes. Every other file calls sendEmail().
 *
 * ENV VARS:
 *   RESEND_API_KEY    — Resend API key
 *   RESEND_FROM_EMAIL — verified sender (e.g., noreply@yourdomain.com)
 *
 * ERROR HANDLING:
 * Throws on failure. Caller (orchestrator) catches and logs.
 */

import { Resend } from "resend";

/**
 * Send a plain-text email to one recipient.
 *
 * @param to      - Recipient email address.
 * @param subject - Email subject line.
 * @param text    - Plain-text body.
 * @throws Error if API key is missing or Resend returns an error.
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("[sendEmail] Missing RESEND_API_KEY env var.");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `Impact Trail <${fromEmail}>`,
    to: [to],
    subject,
    text,
  });

  if (error) {
    throw new Error(`[sendEmail] Resend error for ${to}: ${error.message}`);
  }
}
