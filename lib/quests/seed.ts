/**
 * seed.ts — Seed daily quests into Supabase programmatically.
 *
 * Run with: npx tsx lib/quests/seed.ts
 *
 * NOTE: The migration.sql already seeds via SQL INSERTs.
 * Use this script only if you need to re-seed without running the full migration.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { QUEST_SEED_DATA } from "./seed-data";

// Load .env from project root
config({ path: resolve(__dirname, "../../.env") });
// Also try .env.local (Next.js convention)
config({ path: resolve(__dirname, "../../.env.local") });

async function seed() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase env vars. Looked for:");
    console.error("   NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL");
    console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY");
    console.error("");
    console.error("   Found in env:");
    console.error("   NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(not set)");
    console.error("   SUPABASE_URL =", process.env.SUPABASE_URL ?? "(not set)");
    console.error("");
    console.error("   Make sure your .env or .env.local file is in the project root.");
    process.exit(1);
  }

  console.log("🔗 Supabase URL:", supabaseUrl.slice(0, 30) + "...");

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("🌱 Seeding daily quests into Supabase...\n");
  console.log(`   Total quests to seed: ${QUEST_SEED_DATA.length}`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const quest of QUEST_SEED_DATA) {
    // Check if quest already exists by title
    const { data: existing } = await supabase
      .from("dailyQuest")
      .select("id")
      .eq("title", quest.title)
      .limit(1)
      .single();

    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("dailyQuest").insert({
      title: quest.title,
      description: quest.description,
      category: quest.category,
      xp_reward: quest.xp_reward,
      estimated_minutes: quest.estimated_minutes,
      proof_type: quest.proof_type,
      is_daily: quest.is_daily,
      weight: quest.weight,
    });

    if (error) {
      console.error(`   ❌ Failed: "${quest.title}" — ${error.message}`);
      failed++;
    } else {
      inserted++;
    }
  }

  console.log(`\n   ✅ Inserted: ${inserted}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
  if (failed > 0) console.log(`   ❌ Failed: ${failed}`);
  console.log("\n🌱 Seeding complete!");
}

seed();
