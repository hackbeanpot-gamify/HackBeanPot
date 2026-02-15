/**
 * lib/jobs/test-email-all.ts
 *
 * Assigns a quest to every user for today and emails ALL of them.
 * Run with: npx tsx lib/jobs/test-email-all.ts
 *
 * @ts-nocheck
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local") });

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createHmac } from "crypto";

function makeConfirmUrl(assignmentId: string, userId: string): string {
  const secret = process.env.CRON_SECRET ?? "";
  const payload = `${assignmentId}:${userId}`;
  const token = createHmac("sha256", secret).update(payload).digest("hex");
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  return `${base}/api/quest/confirm?id=${assignmentId}&uid=${userId}&token=${token}`;
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const resend = new Resend(resendKey!);

function today(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

const EMOJI: Record<string, string> = {
  cleanup: "🧹", environment: "🌱", social: "👋",
  kindness: "💛", community: "🏘️", civic: "🏛️", volunteer: "🤝",
};

async function main() {
  console.log("═".repeat(60));
  console.log("📬 SEND DAILY QUEST EMAIL TO ALL USERS");
  console.log("═".repeat(60));
  console.log(`   Date: ${today()}\n`);

  // ── 1. Get all users ──
  const { data: users, error: usersErr } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .not("email", "is", null)
    .neq("email", "");

  if (usersErr || !users?.length) {
    console.error("❌ No users found:", usersErr?.message);
    return;
  }
  console.log(`✅ Found ${users.length} users:`);
  users.forEach((u: any) => console.log(`   • ${u.email} (${u.display_name ?? "no name"})`));

  // ── 2. Get all active daily quests ──
  const { data: quests, error: questsErr } = await supabase
    .from("dailyQuest")
    .select("*")
    .eq("is_daily", true)
    .eq("active", true);

  if (questsErr || !quests?.length) {
    console.error("❌ No active quests:", questsErr?.message);
    return;
  }
  console.log(`✅ Found ${quests.length} active quests\n`);

  let sent = 0;
  const skipped = 0;
  let failed = 0;

  // ── 3. Process each user ──
  for (const user of users) {
    console.log(`\n── Processing: ${user.email} ──`);

    // Check for existing assignment
    const { data: existing } = await supabase
      .from("dailyQuestAssignment")
      .select("id, emailed_at, quest_id")
      .eq("user_id", user.id)
      .eq("assigned_date", today())
      .maybeSingle();

    let assignmentId: string;
    let questId: string;

    if (existing) {
      assignmentId = existing.id;
      questId = existing.quest_id;

      if (existing.emailed_at) {
        console.log(`   ⏭️  Already emailed (emailed_at=${existing.emailed_at})`);

        // Reset emailed_at so we can re-send for testing
        await supabase
          .from("dailyQuestAssignment")
          .update({ emailed_at: null })
          .eq("id", assignmentId);
        console.log(`   🔄 Reset emailed_at for re-test`);
      } else {
        console.log(`   ✅ Assignment exists, not yet emailed`);
      }
    } else {
      // Pick a random quest
      const randomQuest = quests[Math.floor(Math.random() * quests.length)];
      questId = randomQuest.id;

      const { data: newAssignment, error: createErr } = await supabase
        .from("dailyQuestAssignment")
        .insert({
          user_id: user.id,
          quest_id: questId,
          assigned_date: today(),
          status: "assigned",
        })
        .select("id")
        .single();

      if (createErr) {
        console.error(`   ❌ Failed to create assignment: ${createErr.message}`);
        failed++;
        continue;
      }
      assignmentId = newAssignment.id;
      console.log(`   ✅ Created assignment (id=${assignmentId})`);
    }

    // Get quest details
    const quest = quests.find((q: any) => q.id === questId);
    if (!quest) {
      console.error(`   ❌ Quest not found: ${questId}`);
      failed++;
      continue;
    }

    // Build email
    const name = user.display_name ?? "Quester";
    const emoji = EMOJI[quest.category] ?? "🎯";
    const confirmUrl = makeConfirmUrl(assignmentId, user.id);
    const subject = `🎢 Your Daily Quest: ${quest.title}`;
    const text = [
      `Hey ${name}! 👋`,
      ``,
      `Your daily Impact Trail quest is ready:`,
      ``,
      `${emoji}  ${quest.title}`,
      `${quest.description}`,
      ``,
      `⏱️  ~${quest.estimated_minutes} min  |  ⭐ +${quest.xp_reward} XP`,
      ``,
      `✅ Mark as done (one click): ${confirmUrl}`,
      ``,
      `View your quest: ${appBaseUrl}/daily`,
      ``,
      `Keep your streak alive! 🔥`,
      `— The Impact Trail Team 🎢`,
    ].join("\n");

    // Send email
    try {
      const { error: sendErr } = await resend.emails.send({
        from: `Impact Trail <${fromEmail}>`,
        to: [user.email],
        subject,
        text,
      });

      if (sendErr) {
        console.error(`   ❌ Resend error: ${sendErr.message}`);
        failed++;
        continue;
      }

      console.log(`   📧 Email sent to ${user.email}`);

      // Mark emailed
      await supabase
        .from("dailyQuestAssignment")
        .update({ emailed_at: new Date().toISOString() })
        .eq("id", assignmentId);

      console.log(`   ✅ Marked emailed_at`);
      sent++;
    } catch (err: any) {
      console.error(`   ❌ Send failed: ${err.message}`);
      failed++;
    }

    // Rate limit (Resend free tier)
    await new Promise((r) => setTimeout(r, 800));
  }

  // ── Summary ──
  console.log("\n" + "═".repeat(60));
  console.log(`📊 RESULTS: sent=${sent} skipped=${skipped} failed=${failed}`);
  console.log("═".repeat(60));

  if (sent > 0) {
    console.log(`\n🎉 Check inboxes for quest emails!`);
    users.forEach((u: any) => console.log(`   📬 ${u.email}`));
  }
}

main().catch((err) => {
  console.error("\n💥 FATAL:", err.message);
  process.exit(1);
});
