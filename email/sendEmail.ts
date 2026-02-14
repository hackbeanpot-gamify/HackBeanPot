/**
 * sendEmail.ts
 * Reusable email helper using the Resend SDK.
 * Requires: npm install resend
 * Env var: RESEND_API_KEY, RESEND_FROM_EMAIL
 */

import { Resend } from "resend";

/**
 * Send an email via Resend for Impact Trail notifications.
 * @param to - recipient email address
 * @param subject - email subject line
 * @param body - email body (plain text — will be wrapped in simple HTML if no html param)
 * @param html - optional pre-built HTML body (overrides auto-conversion)
 */
export async function sendEmail(to: string, subject: string, body: string, html?: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY must be set in env");
  }

  if (!to) {
    throw new Error("Recipient email address is required");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  // Use provided HTML or convert plain text to simple HTML
  const htmlContent = html ?? body
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br>" : `<p>${line}</p>`))
    .join("");

  const { data, error } = await resend.emails.send({
    from: `Impact Trail <${fromEmail}>`,
    to: [to],
    subject,
    html: htmlContent,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { data, error: null };
}
