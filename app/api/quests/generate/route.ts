// API: POST /api/quests/generate — AI-generated quests from community reports
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { QuestCategory } from "@/types";

interface GeneratedQuest {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
  suggestedNewCategory?: string;
}

const VALID_CATEGORIES: QuestCategory[] = [
  "cleanup",
  "volunteer",
  "kindness",
  "environment",
  "community",
];
const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

// Hardcoded community reports for MVP
const HARDCODED_REPORTS = [
  {
    id: 1,
    title: "Trash accumulating on Main Street",
    description: "Garbage and litter piling up near the Main Street intersection, attracting rats",
    category: "cleanup",
    location: "Boston",
    upvotes: 12,
  },
  {
    id: 2,
    title: "Park benches need repair",
    description: "Several benches in Central Park are broken and need maintenance",
    category: "environment",
    location: "Boston",
    upvotes: 8,
  },
  {
    id: 3,
    title: "Food insecurity in community",
    description: "Many families in the area lack access to fresh food and basic groceries",
    category: "volunteer",
    location: "Boston",
    upvotes: 15,
  },
  {
    id: 4,
    title: "Graffiti on neighborhood walls",
    description: "Walls and storefronts covered with unwanted graffiti",
    category: "cleanup",
    location: "Boston",
    upvotes: 6,
  },
  {
    id: 5,
    title: "Elderly neighbors need assistance",
    description: "Several senior citizens in the neighborhood need help with shopping and tasks",
    category: "kindness",
    location: "Boston",
    upvotes: 10,
  },
];

// Hardcoded sample quests for MVP fallback
const HARDCODED_SAMPLE_QUESTS: GeneratedQuest[] = [
  {
    title: "Clean up Main Street litter",
    description: "Spend 30 minutes picking up trash and debris on Main Street near the intersection",
    category: "cleanup",
    difficulty: "easy",
    xp_reward: 75,
  },
  {
    title: "Help elderly neighbor with groceries",
    description: "Assist an elderly neighbor with carrying groceries or light household tasks",
    category: "kindness",
    difficulty: "easy",
    xp_reward: 60,
  },
  {
    title: "Remove graffiti from neighborhood walls",
    description: "Help remove graffiti from storefronts and walls in the neighborhood",
    category: "cleanup",
    difficulty: "medium",
    xp_reward: 150,
  },
  {
    title: "Repair park benches",
    description: "Help repair or clean broken benches in Central Park",
    category: "environment",
    difficulty: "medium",
    xp_reward: 180,
  },
  {
    title: "Volunteer at local food bank",
    description: "Spend an hour volunteering at the local food bank helping distribute food",
    category: "volunteer",
    difficulty: "hard",
    xp_reward: 300,
  },
];

function validateQuest(quest: any): boolean {
  if (quest.suggestedNewCategory) {
    console.log(
      `[Quest Generation] Gemini suggested new category: ${quest.suggestedNewCategory} for quest: ${quest.title}`
    );
  }

  return !!(
    quest.title &&
    typeof quest.title === "string" &&
    quest.title.length > 0 &&
    quest.description &&
    typeof quest.description === "string" &&
    quest.category &&
    VALID_CATEGORIES.includes(quest.category) &&
    quest.difficulty &&
    VALID_DIFFICULTIES.includes(quest.difficulty) &&
    quest.xp_reward &&
    typeof quest.xp_reward === "number" &&
    quest.xp_reward > 0
  );
}

function cleanJsonResponse(text: string): string {
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const userCity = "Boston"; // Default city (can be made dynamic)
  const userId = Math.floor(Math.random() * 1000); // MVP: random integer ID
  let reportsToUse = HARDCODED_REPORTS;

  try {
    // Fetch real community reports from Supabase
    const { data: dbReports, error: reportsError } = await supabase
      .from("communityReports")
      .select("*")
      .eq("status", "open")
      .limit(15);

    if (reportsError) {
      console.error("Error fetching reports:", reportsError);
    } else if (dbReports && dbReports.length > 0) {
      reportsToUse = dbReports;
    }

    // Generate quests using Gemini AI
    const prompt = `You are a community engagement AI for Impact Trail, an app that gamifies civic participation in ${userCity}.

TASK: Analyze the following community reports and generate 3-5 daily micro-quests for a user to address these issues.

COMMUNITY REPORTS:
${reportsToUse.map((r: any, i: number) => `${i + 1}. [${r.category}] ${r.title} - ${r.description} (${r.upvotes} upvotes, Location: ${r.location || "N/A"})`).join("\n")}

REQUIREMENTS:
1. Generate 3-5 quests with diverse categories
2. IMPORTANT - Use ONLY these predefined categories (these are enumerated types in our system):
   - cleanup
   - volunteer
   - kindness
   - environment
   - community

   If you absolutely need a new category that doesn't fit any of these, include a "suggestedNewCategory" field in your response, but still assign one of the existing categories to the quest.

3. Each quest should be:
   - Actionable and completable within 15-60 minutes
   - Specific to the ${userCity} community issues mentioned
   - Suitable for individual participation
   - Clear and motivating

4. Difficulty levels:
   - easy: 5-15 min tasks (50-100 XP reward)
   - medium: 20-45 min tasks (150-250 XP reward)
   - hard: 45-60+ min tasks (300-500 XP reward)

5. Quest titles: 5-10 words, descriptions: 15-30 words

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "quests": [
    {
      "title": "Clear Litter from Main Street Park",
      "description": "Spend 20 minutes picking up trash and litter around Main Street Park benches and pathways.",
      "category": "cleanup",
      "difficulty": "easy",
      "xp_reward": 75
    }
  ]
}

Generate the quests now:`;

    // Try using Gemini API via REST instead of SDK
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY not found in environment");
    }

    // Try v1 API endpoint instead of v1beta
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      throw new Error(
        `Gemini API error: ${geminiResponse.status} - ${errorData}`
      );
    }

    const geminiData = await geminiResponse.json();
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      throw new Error("No response text from Gemini API");
    }

    const cleanedText = cleanJsonResponse(responseText);
    const parsed = JSON.parse(cleanedText);
    const generatedQuests: GeneratedQuest[] = parsed.quests || [];

    // Validate quests
    const validQuests = generatedQuests.filter(validateQuest);

    if (validQuests.length === 0) {
      return NextResponse.json(
        {
          error: "No valid quests generated",
          details: "AI response did not contain valid quests",
        },
        { status: 500 }
      );
    }

    // Format response with hardcoded quests (no DB insertion for MVP)
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt = new Date().toISOString();

    const formattedQuests = validQuests.map((quest, index) => ({
      id: `quest-${userId}-${index}`,
      user_id: userId,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      xp_reward: quest.xp_reward,
      is_completed: false,
      created_at: createdAt,
      expires_at: expiresAt,
    }));

    return NextResponse.json({
      success: true,
      userId,
      count: formattedQuests.length,
      quests: formattedQuests,
      expiresAt,
      source: "community_reports",
      generatedFrom: `${reportsToUse.length} community reports`,
      note: "MVP: Using real Supabase data. IDs are integers for MVP.",
    });
  } catch (error) {
    // Fallback to hardcoded quests if Gemini fails (MVP mode)
    console.log("[Quest Generation] Gemini API failed, using hardcoded fallback quests");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Gemini Error:", errorMessage);

    // Use hardcoded sample quests as fallback
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();
    const createdAt = new Date().toISOString();

    const formattedQuests = HARDCODED_SAMPLE_QUESTS.map((quest, index) => ({
      id: `quest-${userId}-${index}`,
      user_id: userId,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty: quest.difficulty,
      xp_reward: quest.xp_reward,
      is_completed: false,
      created_at: createdAt,
      expires_at: expiresAt,
    }));

    return NextResponse.json({
      success: true,
      userId,
      count: formattedQuests.length,
      quests: formattedQuests,
      expiresAt,
      source: "fallback_hardcoded",
      generatedFrom: `${reportsToUse.length} community reports (AI generation failed, using sample quests)`,
      note: "MVP: Gemini API failed, returned hardcoded sample quests instead",
    });
  }
}
