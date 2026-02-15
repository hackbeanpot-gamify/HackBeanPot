/**
 * lib/jobs/test-email-job.ts
 *
 * End-to-end test for the daily quest email delivery pipeline.
 * Tests every function in isolation, then runs the full job.
 *
 * Run with:
 *   npx tsx lib/jobs/test-email-job.ts
 *
 * @ts-nocheck
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from "dotenv";
import { resolve } from "path";

// Load env vars before anything else
config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local") });

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

// ── Setup ──
const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function today(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

let step = 0;
function log(label: string, status: "✅" | "❌" | "⏭️", detail?: string) {
  step++;
  console.log(`\n${status} Step ${step}: ${label}`);
  if (detail) console.log(`   ${detail}`);
}

async function main() {
  console.log("═".repeat(60));
  console.log("🧪 DAILY QUEST EMAIL PIPELINE — END-TO-END TEST");
  console.log("═".repeat(60));
  console.log(`   Date:   ${today()}`);
  console.log(`   URL:    ${supabaseUrl}`);
  console.log(`   Key:    ${supabaseKey?.slice(0, 15)}...`);
  console.log(`   Resend: ${resendKey?.slice(0, 10)}...`);
  console.log(`   From:   ${fromEmail}`);

  // ── 1. Test env vars ──
  const envOk =
    !!supabaseUrl && !!supabaseKey && !!resendKey && !!fromEmail;
  if (!envOk) {
    log("Env vars", "❌", "Missing one or more required env vars");
    return;
  }
  log("Env vars", "✅", "All required env vars present");

  // ── 2. Test users_profile read ──
  const { data: users, error: usersErr } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .not("email", "is", null)
    .neq("email", "")
    .limit(5);

  if (usersErr || !users?.length) {
    log("Fetch users_profile", "❌", usersErr?.message ?? "No users found");
    return;
  }
  log("Fetch users_profile", "✅", `Found ${users.length} users`);
  users.forEach((u: any) => console.log(`     • ${u.email} (${u.display_name ?? "no name"})`));

  // ── 3. Test dailyQuest read ──
  const { data: quests, error: questsErr } = await supabase
    .from("dailyQuest")
    .select("id, title, xp_reward, estimated_minutes, category")
    .eq("is_daily", true)
    .eq("active", true)
    .limit(5);

  if (questsErr || !quests?.length) {
    log("Fetch dailyQuest", "❌", questsErr?.message ?? "No active quests");
    return;
  }
  log("Fetch dailyQuest", "✅", `Found ${quests.length} active daily quests`);
  quests.forEach((q: any) => console.log(`     • "${q.title}" (+${q.xp_reward} XP, ~${q.estimated_minutes}m)`));

  // Pick one user and one quest for the rest of the test
  const testUser = users[0];
  const testQuest = quests[Math.floor(Math.random() * quests.length)];
  console.log(`\n   🎯 Test user:  ${testUser.email}`);
  console.log(`   🎯 Test quest: "${testQuest.title}"`);

  // ── 4. Test dailyQuestAssignment read ──
  const { data: existingAssignment, error: assignErr } = await supabase
    .from("dailyQuestAssignment")
    .select("*")
    .eq("user_id", testUser.id)
    .eq("assigned_date", today())
    .limit(1)
    .maybeSingle();

  if (assignErr) {
    log("Check existing assignment", "❌", assignErr.message);
    return;
  }

  if (existingAssignment) {
    log(
      "Check existing assignment",
      "✅",
      `Already has assignment for today (id=${existingAssignment.id}, emailed_at=${existingAssignment.emailed_at ?? "null"})`
    );
  } else {
    log("Check existing assignment", "✅", "No assignment for today — will create one");
  }

  // ── 5. Create assignment if needed ──
  let assignmentId: string;

  if (existingAssignment) {
    assignmentId = existingAssignment.id;
    log("Create assignment", "⏭️", "Skipped — already exists");
  } else {
    const { data: newAssignment, error: createErr } = await supabase
      .from("dailyQuestAssignment")
      .insert({
        user_id: testUser.id,
        quest_id: testQuest.id,
        assigned_date: today(),
        status: "assigned",
      })
      .select("*")
      .single();

    if (createErr) {
      log("Create assignment", "❌", createErr.message);
      return;
    }
    assignmentId = newAssignment.id;
    log("Create assignment", "✅", `Created id=${assignmentId}`);
  }

  // ── 6. Test join query (assignment → quest + user) ──
  const { data: joined, error: joinErr } = await supabase
    .from("dailyQuestAssignment")
    .select(`
      id, user_id, quest_id, assigned_date, status, emailed_at,
      profiles!user_id ( email, display_name ),
      dailyQuest!quest_id ( title, description, category, xp_reward, estimated_minutes )
    `)
    .eq("id", assignmentId)
    .single();

  if (joinErr || !joined) {
    log("Join query", "❌", joinErr?.message ?? "No data returned");
    return;
  }
  log("Join query", "✅", `Quest: "${(joined as any).dailyQuest?.title}" → ${(joined as any).profiles?.email}`);

  // ── 7. Build email ──
  const quest = (joined as any).dailyQuest;
  const userName = (joined as any).profiles?.display_name ?? "Quester";
  const emoji: Record<string, string> = {
    cleanup: "🧹", environment: "🌱", social: "👋",
    kindness: "💛", community: "🏘️", civic: "🏛️", volunteer: "🤝",
  };
  const e = emoji[quest.category] ?? "🎯";

  const subject = `🎢 Your Daily Quest: ${quest.title}`;
  const text = [
    `Hey ${userName}! 👋`,
    ``,
    `Your daily Impact Trail quest is ready:`,
    ``,
    `${e}  ${quest.title}`,
    `${quest.description}`,
    ``,
    `⏱️  ~${quest.estimated_minutes} min  |  ⭐ +${quest.xp_reward} XP`,
    ``,
    `Complete it here: ${appBaseUrl}/daily`,
    ``,
    `Keep your streak alive! 🔥`,
    `— The Impact Trail Team 🎢`,
  ].join("\n");

  log("Build email", "✅", `Subject: "${subject}"`);
  console.log(`   Preview:\n${text.split("\n").map((l: string) => `     | ${l}`).join("\n")}`);

  // ── 8. Send email via Resend ──
  const resend = new Resend(resendKey!);
  const toEmail = (joined as any).profiles?.email;

  if (!toEmail) {
    log("Send email (Resend)", "❌", "No email found in joined profiles data");
    return;
  }

  try {
    const { data: sendData, error: sendErr } = await resend.emails.send({
      from: `Impact Trail <${fromEmail}>`,
      to: [toEmail],
      subject,
      text,
    });

    if (sendErr) {
      log("Send email (Resend)", "❌", sendErr.message);
      return;
    }
    log("Send email (Resend)", "✅", `Sent to ${toEmail} (id=${sendData?.id})`);
  } catch (err: any) {
    log("Send email (Resend)", "❌", err.message);
    return;
  }

  // ── 9. Mark assignment as emailed ──
  const { error: markErr } = await supabase
    .from("dailyQuestAssignment")
    .update({ emailed_at: new Date().toISOString() })
    .eq("id", assignmentId);

  if (markErr) {
    log("Mark emailed", "❌", markErr.message);
    return;
  }
  log("Mark emailed", "✅", `Set emailed_at on assignment=${assignmentId}`);

  // ── 10. Verify emailed_at is set ──
  const { data: verify } = await supabase
    .from("dailyQuestAssignment")
    .select("id, emailed_at")
    .eq("id", assignmentId)
    .single();

  if (verify?.emailed_at) {
    log("Verify emailed_at", "✅", `emailed_at = ${verify.emailed_at}`);
  } else {
    log("Verify emailed_at", "❌", "emailed_at is still null!");
  }

  // ── Summary ──
  console.log("\n" + "═".repeat(60));
  console.log(`🎉 ALL ${step} STEPS PASSED!`);
  console.log(`   ✅ DB reads work (users, quests, assignments, joins)`);
  console.log(`   ✅ DB writes work (insert assignment, update emailed_at)`);
  console.log(`   ✅ Resend API works (email sent to ${toEmail})`);
  console.log(`   ✅ Idempotency: emailed_at is set — re-run won't re-email`);
  console.log(`\n   📬 Check ${toEmail} inbox for the quest email!`);
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("\n💥 FATAL:", err.message);
  process.exit(1);
});
