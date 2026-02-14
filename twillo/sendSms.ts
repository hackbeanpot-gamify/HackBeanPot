/**
 * sendSms.ts
 * Send an SMS via the official Twilio Node SDK.
 * Requires: npm install twilio
 * Env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

// DEPRECATED — SMS has been replaced with email notifications.
// See /email/sendEmail.ts for the new implementation.
// This file is kept only for reference and can be deleted.

import twilio from "twilio";

type UserLike = {
  phone?: string | null;
  name?: string;
};

/**
 * Send an SMS to a user's phone using the Twilio SDK.
 * @param user - object with `phone` in E.164 format (e.g. +15551234567)
 * @param message - message body to send
 */
export async function sendSmsToUser(user: UserLike, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER must be set in env");
  }

  const to = user?.phone;
  if (!to) {
    throw new Error("User object must include a phone number in `user.phone`");
  }

  const client = twilio(accountSid, authToken);

  const result = await client.messages.create({
    body: message,
    from: fromNumber,
    to: to,
  });

  return result;
}
