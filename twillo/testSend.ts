/**
 * Quick test — run with:
 *   npx tsx twillo/testSend.ts
 *
 * Requires .env with TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

import "dotenv/config";
import { sendSmsToUser } from "./sendSms";

async function main() {
  try {
    const result = await sendSmsToUser(
      { phone: "+19175820463", name: "Jackson" },
      "Hey Jackson! This is a test from ____Quest 🎢"
    );
    console.log("✅ Message sent successfully!");
    console.log("SID:", result.sid);
    console.log("Status:", result.status);
    console.log("Body:", result.body);
  } catch (err) {
    console.error("❌ Failed to send:", err);
  }
}

main();

// DEPRECATED — SMS has been replaced with email notifications.
// See /email/testEmail.ts for the new test script.
