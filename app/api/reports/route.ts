// API: GET + POST /api/reports — community reports CRUD
// POST flow: save complaint → Gemini checks DB for matching quest → bump weight OR create new quest
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiModel } from "@/lib/gemini";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communityReports")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { title, description, category, userId } = body;

    if (!title || !description || !category || !userId) {
      return NextResponse.json(
        { error: "title, description, category, and userId are required" },
        { status: 400 }
      );
    }

    // Step 1: Save the complaint to communityReports
    const { data: report, error: reportError } = await supabase
      .from("communityReports")
      .insert({ title, description, category, status: "open", userId })
      .select()
      .single();

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    // Step 2: Fetch all existing quests from DB so Gemini can see what we have
    const { data: existingQuests } = await supabase
      .from("dailyQuests")
      .select("id, title, category, difficulty")
      .limit(50);

    const questList = existingQuests || [];

    // Step 3: Ask Gemini — does this complaint match an existing quest, or do we need a new one?
    // Minimal prompt to save tokens
    const prompt = `Complaint: "${title}: ${description}" (category: ${category})
Existing quests: ${questList.map((q: { id: number; title: string; category: string; difficulty: string }) => `[id:${q.id}] ${q.title} (${q.category}/${q.difficulty})`).join("; ")}
Does this complaint match an existing quest? If yes, return {"match":true,"questId":<id>}. If no existing quest fits, return {"match":false,"quest":{"title":"...","description":"...","category":"${category}","difficulty":"easy|medium|hard","xp_reward":75|200|400}} with title 5-8 words verb-first, description 15-25 words.`;

    let questAction: { type: "bumped" | "created"; quest: Record<string, unknown> } | null = null;

    try {
      const result = await geminiModel.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText) {
        const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        const parsed = JSON.parse(cleaned);

        if (parsed.match && parsed.questId) {
          // Match found — bump the weight of the existing quest
          const matchId = parsed.questId;

          // Get current weight
          const { data: matchedQuest } = await supabase
            .from("dailyQuests")
            .select("*")
            .eq("id", matchId)
            .single();

          if (matchedQuest) {
            const newWeight = (matchedQuest.weight || 1) + 1;
            await supabase
              .from("dailyQuests")
              .update({ weight: newWeight })
              .eq("id", matchId);

            questAction = {
              type: "bumped",
              quest: { ...matchedQuest, weight: newWeight },
            };
          }
        } else if (!parsed.match && parsed.quest) {
          // No match — create new quest from Gemini's suggestion
          const q = parsed.quest;

          // Validate before inserting
          const validCategories = ["cleanup", "volunteer", "kindness", "environment", "community"];
          const validDifficulties = ["easy", "medium", "hard"];

          if (
            q.title && q.description &&
            validCategories.includes(q.category) &&
            validDifficulties.includes(q.difficulty) &&
            typeof q.xp_reward === "number"
          ) {
            const { data: newQuest, error: insertErr } = await supabase
              .from("dailyQuests")
              .insert({
                title: q.title,
                description: q.description,
                category: q.category,
                difficulty: q.difficulty,
                xpReward: q.xp_reward,
                weight: 1,
              })
              .select()
              .single();

            if (!insertErr && newQuest) {
              questAction = { type: "created", quest: newQuest };
            }
          }
        }
      }
    } catch (geminiErr) {
      // Gemini failed — complaint is still saved, quest matching just didn't happen
      console.error("Gemini quest matching failed:", geminiErr);
    }

    return NextResponse.json({
      success: true,
      report,
      questAction: questAction
        ? {
            type: questAction.type,
            questId: questAction.quest.id,
            questTitle: questAction.quest.title,
            newWeight: questAction.quest.weight,
          }
        : null,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
