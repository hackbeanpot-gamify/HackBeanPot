/**
 * testEmail.ts
 *
 * Integration test for Impact Trail email notifications via Resend.
 * Validates env config, sends a real email, and reports results.
 *
 * Usage:
 *   npx tsx email/testEmail.ts                          # sends to default
 *   npx tsx email/testEmail.ts someone@example.com      # sends to provided address
 *
 * Requires .env:
 *   RESEND_API_KEY=re_...
 *   RESEND_FROM_EMAIL=noreply@jacksonzhengn8n.com
 */

import "dotenv/config";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  sendDailyQuestReminder,
  sendStreakWarning,
  sendXpMilestone,
} from "./notifications";

/* ── Config ── */
const DEFAULT_RECIPIENT = "Jacksonzheng425@gmail.com";
const recipient = process.argv[2] || DEFAULT_RECIPIENT;

/* ── Helpers ── */
function logHeader(title: string) {
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(50)}\n`);
}

function logPass(label: string, detail?: string) {
  console.log(`  ✅ ${label}${detail ? ` — ${detail}` : ""}`);
}

function logFail(label: string, detail?: string) {
  console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Pre-flight checks ── */
function preflight(): boolean {
  logHeader("1. Pre-flight Checks");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  let ok = true;

  if (apiKey) {
    logPass("RESEND_API_KEY", `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`);
  } else {
    logFail("RESEND_API_KEY", "not set in .env");
    ok = false;
  }

  if (fromEmail) {
    logPass("RESEND_FROM_EMAIL", fromEmail);
  } else {
    logFail("RESEND_FROM_EMAIL", "not set — will fallback to onboarding@resend.dev");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(recipient)) {
    logPass("Recipient", recipient);
  } else {
    logFail("Recipient", `"${recipient}" is not a valid email`);
    ok = false;
  }

  return ok;
}

/* ── Test: basic sendEmail ── */
async function testBasicSend(): Promise<boolean> {
  logHeader("2. Basic Email Send");

  try {
    await sendEmail(
      recipient,
      "🎢 Impact Trail — Integration Test",
      [
        "Hey! This is a test email from Impact Trail.",
        "",
        "If you're reading this, the Resend integration is working correctly.",
        "",
        "— The Impact Trail Team 🎪",
      ].join("\n")
    );

    logPass("Email sent successfully");
    return true;
  } catch (err) {
    logFail("Exception thrown", (err as Error).message);
    return false;
  }
}

/* ── Test: notification templates ── */
async function testNotifications(): Promise<boolean> {
  logHeader("3. Notification Templates");

  const user = { email: recipient, name: "Jackson" };
  let allPassed = true;

  // Daily quest reminder
  try {
    await sendDailyQuestReminder(user);
    logPass("Daily Quest Reminder sent");
  } catch (err) {
    logFail("Daily Quest Reminder", (err as Error).message);
    allPassed = false;
  }

  await wait(1500);

  // Streak warning
  try {
    await sendStreakWarning(user, 42);
    logPass("Streak Warning (42 days) sent");
  } catch (err) {
    logFail("Streak Warning", (err as Error).message);
    allPassed = false;
  }

  await wait(1500);

  // XP milestone
  try {
    await sendXpMilestone(user, 12, 5000);
    logPass("XP Milestone (Level 12) sent");
  } catch (err) {
    logFail("XP Milestone", (err as Error).message);
    allPassed = false;
  }

  return allPassed;
}

/* ── Main ── */
async function main() {
  console.log("\n🎪 Impact Trail Email Integration Test\n");

  // Pre-flight
  if (!preflight()) {
    console.log("\n⛔ Pre-flight checks failed. Fix the issues above and re-run.\n");
    process.exit(1);
  }

  // Run tests
  const basicOk = await testBasicSend();
  await wait(1500);
  const notifOk = await testNotifications();

  // Summary
  logHeader("Results");
  const total = 4;
  const passed = (basicOk ? 1 : 0) + (notifOk ? 3 : 0);
  console.log(`  ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log(`\n  🎉 All tests passed! Check ${recipient} for the emails.\n`);
  } else {
    console.log(`\n  ⚠️  Some tests failed. Check the errors above.\n`);
    process.exit(1);
  }
}

main();
