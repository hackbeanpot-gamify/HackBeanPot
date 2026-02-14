// API: POST /api/reports — process a user complaint via Gemini
// Flow: complaint string → Gemini checks dailyQuest table → bump weight OR create new quest
// The complaint itself is NOT stored — only the quest outcome is.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { complaint } = body;

    if (!complaint || typeof complaint !== "string" || complaint.trim().length < 5) {
      return NextResponse.json(
        { error: "complaint is required (min 5 characters)" },
        { status: 400 }
      );
    }

    // Step 1: Fetch all active quests so Gemini can compare
    const { data: existingQuests } = await supabase
      .from("dailyQuest")
      .select("id, title, category, xp_reward, weight")
      .eq("active", true)
      .limit(50);

    const questList = existingQuests || [];

    // Step 2: Ask Gemini — does this complaint match an existing quest, or do we need a new one?
    const prompt = `You are a community quest matcher for a Boston volunteering app.

Complaint: "${complaint.trim()}"

Existing quests:
${questList.length > 0 ? questList.map((q: { id: string; title: string; category: string; xp_reward: number }) => `[id:${q.id}] "${q.title}" (${q.category}, ${q.xp_reward}xp)`).join("\n") : "(none)"}

RULES:
- If the complaint matches an existing quest's theme, return: {"match":true,"questId":"<uuid>"}
- If no quest fits, return a new quest: {"match":false,"quest":{"title":"...","description":"...","category":"...","xp_reward":...,"estimated_minutes":...,"proof_type":"..."}}
- title: 5-8 words, verb-first, specific to Boston
- description: 15-25 words, actionable task
- category: MUST be one of: cleanup, volunteer, kindness, environment, community
- xp_reward: easy=75, medium=200, hard=400
- estimated_minutes: realistic estimate (15-120)
- proof_type: one of: photo, checkin, self_report
- Return ONLY valid JSON, nothing else.`;

    let questAction: { type: "bumped" | "created"; quest: Record<string, unknown> } | null = null;

    try {
      const result = await geminiModel.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText) {
        const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);

        if (parsed.match && parsed.questId) {
          // Match found — bump the weight of the existing quest
          const { data: matchedQuest } = await supabase
            .from("dailyQuest")
            .select("*")
            .eq("id", parsed.questId)
            .single();

          if (matchedQuest) {
            const newWeight = (matchedQuest.weight || 1) + 1;
            await supabase
              .from("dailyQuest")
              .update({ weight: newWeight })
              .eq("id", parsed.questId);

            questAction = {
              type: "bumped",
              quest: { ...matchedQuest, weight: newWeight },
            };
          }
        } else if (!parsed.match && parsed.quest) {
          // No match — create new quest from Gemini's suggestion
          const q = parsed.quest;
          const validCategories = ["cleanup", "volunteer", "kindness", "environment", "community"];
          const validProofTypes = ["photo", "checkin", "self_report"];

          if (
            q.title && q.description &&
            validCategories.includes(q.category) &&
            typeof q.xp_reward === "number"
          ) {
            const { data: newQuest, error: insertErr } = await supabase
              .from("dailyQuest")
              .insert({
                title: q.title,
                description: q.description,
                category: q.category,
                xp_reward: q.xp_reward,
                estimated_minutes: q.estimated_minutes || 30,
                proof_type: validProofTypes.includes(q.proof_type) ? q.proof_type : "self_report",
                is_daily: true,
                weight: 1,
                active: true,
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
      console.error("Gemini quest matching failed:", geminiErr);
    }

    return NextResponse.json({
      success: true,
      complaint: complaint.trim(),
      questAction: questAction
        ? {
            type: questAction.type,
            questId: questAction.quest.id,
            questTitle: questAction.quest.title,
            newWeight: questAction.quest.weight,
          }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
