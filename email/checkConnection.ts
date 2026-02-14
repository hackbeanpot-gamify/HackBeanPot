/**
 * checkConnection.ts — run with:
 *   npx tsx email/checkConnection.ts
 *
 * Verifies Resend API key is valid for Impact Trail.
 */

import "dotenv/config";
import { Resend } from "resend";

async function check() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  console.log("── Resend Connection Check ──\n");
  console.log("API Key:", apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "❌ NOT SET");
  console.log("From Email:", fromEmail);
  console.log("");

  if (!apiKey) {
    console.error("❌ Missing RESEND_API_KEY in .env");
    console.log("   Get one at: https://resend.com/api-keys");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const response = await resend.domains.list();
    console.log("✅ API key is valid!");
    const domainsData = response.data;
    const domains = domainsData && "data" in domainsData ? (domainsData as { data: { name: string; status: string }[] }).data : null;
    if (domains && domains.length > 0) {
      console.log(`\n📧 Verified domains (${domains.length}):`);
      for (const d of domains) {
        console.log(`   ${d.name} — ${d.status}`);
      }
    } else {
      console.log("\n⚠️  No verified domains. You can still send from onboarding@resend.dev for testing.");
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error("❌ API key is invalid or request failed:", e.message);
  }
}

check();
