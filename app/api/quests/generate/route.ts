// API: GET /api/quests/generate — serve active daily quests ordered by weight (priority)
// Quests are created/weighted by the reports endpoint when complaints come in.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const QUEST_COUNT = 5;

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: quests, error } = await supabase
      .from("dailyQuest")
      .select("*")
      .eq("active", true)
      .order("weight", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(QUEST_COUNT);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: (quests || []).length,
      quests: quests || [],
    });
  } catch (err) {
    console.error("Error fetching quests:", err);
    return NextResponse.json(
      { error: "Failed to fetch quests" },
      { status: 500 }
    );
  }
}
