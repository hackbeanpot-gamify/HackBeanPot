/**
 * lib/quests/debug-quests.ts
 *
 * Diagnostic script to trace why "No quests assigned today" appears.
 * Run with: npx tsx lib/quests/debug-quests.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USER_ID = "57d33940-2603-474d-b084-285aaf859a0e";

function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

async function main() {
  const today = getTodayDateString();
  console.log("=== Quest Assignment Debug ===\n");
  console.log(`User ID:    ${USER_ID}`);
  console.log(`Today date: ${today}`);
  console.log(`Using key:  ${supabaseKey!.startsWith("eyJ") ? "anon/service key" : "unknown"}`);
  console.log();

  // Step 1: Does the user exist in profiles?
  console.log("--- Step 1: Check user exists in profiles ---");
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .eq("id", USER_ID)
    .single();

  if (profileErr) {
    console.error("  FAIL:", profileErr.message);
  } else {
    console.log("  OK - User found:", profile);
  }
  console.log();

  // Step 2: Are there ANY assignments for this user (no date filter)?
  console.log("--- Step 2: All assignments for this user (no date filter) ---");
  const { data: allAssignments, error: allErr } = await supabase
    .from("dailyQuestAssignment")
    .select("id, user_id, quest_id, assigned_date, status, created_at")
    .eq("user_id", USER_ID);

  if (allErr) {
    console.error("  FAIL:", allErr.message);
  } else if (!allAssignments || allAssignments.length === 0) {
    console.log("  EMPTY - No assignments exist for this user at all.");
    console.log("  >>> This is the problem. No rows in dailyQuestAssignment for this user_id.");
  } else {
    console.log(`  OK - Found ${allAssignments.length} assignment(s):`);
    allAssignments.forEach((a) => {
      console.log(`    id=${a.id}  date=${a.assigned_date}  status=${a.status}  quest_id=${a.quest_id}`);
    });
  }
  console.log();

  // Step 3: Are there assignments for TODAY specifically?
  console.log(`--- Step 3: Assignments for today (${today}) ---`);
  const { data: todayAssignments, error: todayErr } = await supabase
    .from("dailyQuestAssignment")
    .select("id, quest_id, assigned_date, status")
    .eq("user_id", USER_ID)
    .eq("assigned_date", today);

  if (todayErr) {
    console.error("  FAIL:", todayErr.message);
  } else if (!todayAssignments || todayAssignments.length === 0) {
    console.log("  EMPTY - No assignments for today's date.");
    console.log("  >>> Assignments exist but none match today. Check assigned_date values above.");
  } else {
    console.log(`  OK - Found ${todayAssignments.length} assignment(s) for today:`);
    todayAssignments.forEach((a) => {
      console.log(`    id=${a.id}  status=${a.status}  quest_id=${a.quest_id}`);
    });
  }
  console.log();

  // Step 4: Status filter check
  console.log("--- Step 4: Assignments for today with status filter ---");
  const { data: filteredAssignments, error: filteredErr } = await supabase
    .from("dailyQuestAssignment")
    .select("id, quest_id, status")
    .eq("user_id", USER_ID)
    .eq("assigned_date", today)
    .in("status", ["assigned", "completed"]);

  if (filteredErr) {
    console.error("  FAIL:", filteredErr.message);
  } else if (!filteredAssignments || filteredAssignments.length === 0) {
    console.log("  EMPTY - Assignments exist for today but status is not 'assigned' or 'completed'.");
  } else {
    console.log(`  OK - Found ${filteredAssignments.length} matching assignment(s).`);
  }
  console.log();

  // Step 5: Full join query (mirrors the hook exactly)
  console.log("--- Step 5: Full join query (same as useAssignedQuests hook) ---");
  const { data: joined, error: joinErr } = await supabase
    .from("dailyQuestAssignment")
    .select("*, dailyQuest!inner(*)")
    .eq("user_id", USER_ID)
    .eq("assigned_date", today)
    .in("status", ["assigned", "completed"]);

  if (joinErr) {
    console.error("  FAIL:", joinErr.message);
    console.log("  >>> Join failed. Possible FK issue or dailyQuest row missing for the quest_id.");
  } else if (!joined || joined.length === 0) {
    console.log("  EMPTY - Join returned nothing. The quest_id may not exist in dailyQuest table.");
  } else {
    console.log(`  OK - Found ${joined.length} fully joined result(s):`);
    joined.forEach((j: any) => {
      console.log(`    assignment=${j.id}  quest="${j.dailyQuest?.title}"  xp=${j.dailyQuest?.xp_reward}`);
    });
  }
  console.log();

  // Step 6: Check dailyQuest table has active quests
  console.log("--- Step 6: Active daily quests in dailyQuest table ---");
  const { data: activeQuests, error: activeErr } = await supabase
    .from("dailyQuest")
    .select("id, title, is_daily, active")
    .eq("is_daily", true)
    .eq("active", true)
    .limit(5);

  if (activeErr) {
    console.error("  FAIL:", activeErr.message);
  } else {
    console.log(`  Found ${activeQuests?.length ?? 0} active daily quest(s):`);
    activeQuests?.forEach((q) => {
      console.log(`    id=${q.id}  title="${q.title}"`);
    });
  }

  console.log("\n=== Done ===");
}

main();
