/**
 * lib/quests/check-db.ts
 *
 * Quick diagnostic script to verify all tables and queries work.
 * Run with: npx tsx lib/quests/check-db.ts
 *
 * @ts-nocheck
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../.env.local") });

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function check(label: string, fn: () => PromiseLike<{ data: any; error: any }>): Promise<boolean> {
  const { data, error } = await fn();
  if (error) {
    console.error(`❌ ${label}: ${error.message}`);
    return false;
  }
  const count = Array.isArray(data) ? data.length : data ? 1 : 0;
  console.log(`✅ ${label}: ${count} row(s)`);
  if (Array.isArray(data) && data.length > 0) {
    const sample = JSON.stringify(data[0], null, 2).split("\n").slice(0, 5).join("\n   ");
    console.log(`   Sample: ${sample}`);
  }
  return true;
}

async function main() {
  console.log("🔍 Database connectivity check\n");
  console.log(`   URL: ${supabaseUrl!.slice(0, 35)}...`);
  console.log(`   Key: ${supabaseKey!.slice(0, 15)}...\n`);

  let passed = 0;
  let failed = 0;

  const tests: Array<[string, () => PromiseLike<any>]> = [
    ["dailyQuest (all)", () => supabase.from("dailyQuest").select("*").limit(5)],
    ["dailyQuest (active daily)", () => supabase.from("dailyQuest").select("id, title, xp_reward, estimated_minutes, proof_type, weight").eq("is_daily", true).eq("active", true).limit(5)],
    ["users_profile (all)", () => supabase.from("users_profile").select("id, email, display_name").limit(5)],
    ["user_stats (all)", () => supabase.from("user_stats").select("user_id, xp_total, level, streak_current").limit(5)],
    ["dailyQuestAssignment (all)", () => supabase.from("dailyQuestAssignment").select("*").limit(5)],
    ["dailyQuestAssignment JOIN dailyQuest", () => supabase.from("dailyQuestAssignment").select("*, dailyQuest(*)").limit(3)],
    ["raidBossEvent (all)", () => supabase.from("raidBossEvent").select("*").limit(3)],
    ["raidBossRsvp (all)", () => supabase.from("raidBossRsvp").select("*").limit(3)],
    ["organization (all)", () => supabase.from("organization").select("*").limit(3)],
  ];

  for (const [label, fn] of tests) {
    const ok = await check(label, fn);
    if (ok) { passed++; } else { failed++; }
  }

  console.log("\n" + "═".repeat(50));
  console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);

  if (failed === 0) {
    console.log("\n🎉 All checks passed! Database is fully accessible.");
  } else {
    console.log("\n⚠️  Some checks failed. See errors above.");
    console.log("   Common fixes:");
    console.log("   - Run migration.sql in Supabase SQL Editor");
    console.log("   - Add RLS policies (SELECT) for failing tables");
    console.log("   - Check table/column names match your schema");
  }
}

main();
