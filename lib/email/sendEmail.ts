/**
 * lib/email/sendEmail.ts
 *
 * Sends a single email via Resend.
 *
 * WHY THIS EXISTS:
 * This is the ONLY file that calls the Resend API. All other files
 * build email content and pass it here. If we switch providers,
 * only this file changes.
 *
 * ENV VARS:
 *   RESEND_API_KEY    — set in resendClient.ts
 *   RESEND_FROM_EMAIL — verified sender address
 *
 * ERROR HANDLING:
 * Throws on failure. Caller is responsible for catching.
 */

import { getResendClient } from "@/lib/email/resendClient";

/** Input shape for sendEmail. */
export interface SendEmailInput {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** Plain-text body */
  text: string;
  /** Optional HTML body */
  html?: string;
}

/**
 * Send an email to one recipient via Resend.
 *
 * @param input - { to, subject, text, html? }
 * @throws Error if Resend returns an error.
 *
 * @example
 *   await sendEmail({ to: "user@example.com", subject: "Hi", text: "Hello!" });
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: `Impact Trail <${fromEmail}>`,
    to: [input.to],
    subject: input.subject,
    text: input.text,
    ...(input.html ? { html: input.html } : {}),
  });

  if (error) {
    throw new Error(`[sendEmail] Resend error for ${input.to}: ${error.message}`);
  }
}
