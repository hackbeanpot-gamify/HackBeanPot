// API: POST /api/quests/generate — serve daily quests from DB, ordered by weight (priority)
// Quests are created/weighted by the reports endpoint when complaints come in.
// This endpoint just reads and serves the top quests to users.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const QUEST_COUNT = 5;

export async function POST() {
  const supabase = await createClient();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  try {
    // Fetch top quests ordered by weight (highest priority first), then newest
    const { data: quests, error } = await supabase
      .from("dailyQuests")
      .select("*")
      .order("weight", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(QUEST_COUNT);

    if (error) {
      throw error;
    }

    if (quests && quests.length > 0) {
      return NextResponse.json({
        success: true,
        count: quests.length,
        quests,
        expiresAt,
        source: "db",
      });
    }

    // No quests in DB yet — return hardcoded starters
    const starterQuests = [
      { id: "starter-1", title: "Pick Up Litter on Main Street", description: "Spend 15 minutes collecting trash and litter near the Main Street intersection.", category: "cleanup", difficulty: "easy", xpReward: 75, weight: 1 },
      { id: "starter-2", title: "Help an Elderly Neighbor Today", description: "Check in on an elderly neighbor and offer to help with groceries or errands.", category: "kindness", difficulty: "easy", xpReward: 75, weight: 1 },
      { id: "starter-3", title: "Donate Food to Local Food Bank", description: "Bring canned goods or non-perishable items to your nearest food bank or pantry.", category: "volunteer", difficulty: "medium", xpReward: 200, weight: 1 },
      { id: "starter-4", title: "Report Broken Park Benches Nearby", description: "Visit your local park, document damaged benches, and report them to the city via 311.", category: "environment", difficulty: "medium", xpReward: 200, weight: 1 },
      { id: "starter-5", title: "Organize a Neighborhood Cleanup Event", description: "Rally neighbors for a 1-hour cleanup of your block. Bring bags, gloves, and water.", category: "community", difficulty: "hard", xpReward: 400, weight: 1 },
    ];

    return NextResponse.json({
      success: true,
      count: starterQuests.length,
      quests: starterQuests,
      expiresAt,
      source: "starter",
    });
  } catch (err) {
    console.error("Error fetching quests:", err);
    return NextResponse.json(
      { error: "Failed to fetch quests" },
      { status: 500 }
    );
  }
}
