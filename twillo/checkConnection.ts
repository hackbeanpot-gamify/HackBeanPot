/**
 * Twilio connection check — run with:
 *   npx tsx twillo/checkConnection.ts
 *
 * Verifies your Account SID + Auth Token are correct,
 * then lists all phone numbers owned by the account.
 */

// DEPRECATED — SMS has been replaced with email notifications.
// See /email/checkConnection.ts for the new check script.

import "dotenv/config";
import twilio from "twilio";

async function check() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  console.log("── Twilio Connection Check ──\n");
  console.log("Account SID:", accountSid ?? "❌ NOT SET");
  console.log("Auth Token:", authToken ? `${authToken.slice(0, 4)}...${authToken.slice(-4)}` : "❌ NOT SET");
  console.log("From Number:", fromNumber ?? "❌ NOT SET");
  console.log("");

  if (!accountSid || !authToken) {
    console.error("❌ Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in .env");
    return;
  }

  try {
    const client = twilio(accountSid, authToken);

    // 1. Check credentials by fetching account info
    const account = await client.api.accounts(accountSid).fetch();
    console.log("✅ Auth is valid!");
    console.log("   Account Name:", account.friendlyName);
    console.log("   Account Status:", account.status);
    console.log("   Account Type:", account.type);
    console.log("");

    // 2. List all phone numbers owned by this account
    const numbers = await client.incomingPhoneNumbers.list();
    if (numbers.length === 0) {
      console.log("⚠️  No phone numbers found on this account.");
      console.log("   You need to buy a number at:");
      console.log("   https://console.twilio.com/us1/develop/phone-numbers/manage/search");
    } else {
      console.log(`📱 Phone numbers on this account (${numbers.length}):`);
      numbers.forEach((n) => {
        const match = n.phoneNumber === fromNumber ? " ← matches TWILIO_FROM_NUMBER ✅" : "";
        console.log(`   ${n.phoneNumber} (${n.friendlyName})${match}`);
      });
    }
    console.log("");

    // 3. Check if TWILIO_FROM_NUMBER matches any owned number
    if (fromNumber && numbers.length > 0) {
      const owned = numbers.some((n) => n.phoneNumber === fromNumber);
      if (!owned) {
        console.log(`❌ TWILIO_FROM_NUMBER (${fromNumber}) is NOT owned by this account!`);
        console.log("   Update your .env to use one of the numbers listed above.");
      }
    }

    // 4. List verified caller IDs (for trial accounts)
    const verified = await client.outgoingCallerIds.list();
    if (verified.length > 0) {
      console.log(`📋 Verified Caller IDs (numbers you can send TO on trial):`);
      verified.forEach((v) => {
        console.log(`   ${v.phoneNumber} (${v.friendlyName})`);
      });
    } else {
      console.log("⚠️  No verified caller IDs. On a trial account you can only send to verified numbers.");
      console.log("   Verify yours at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified");
    }
  } catch (err: unknown) {
    const e = err as Error & { code?: number; status?: number };
    if (e.status === 401 || e.code === 20003) {
      console.error("❌ Authentication failed — Account SID or Auth Token is wrong.");
    } else {
      console.error("❌ Error:", e.message);
    }
  }
}

check();
