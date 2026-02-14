/**
 * POST /api/notifications/daily-quest
 *
 * Triggers daily quest email notifications.
 *
 * Body options:
 *   { "userId": "abc" }   → send to one user
 *   { "all": true }       → send to all users with pending quests
 *
 * Protected by API_SECRET header for cron/external calls.
 */

import { NextResponse } from "next/server";
import { sendDailyQuestEmail, sendAllDailyQuestEmails } from "@/services/dailyQuestEmail";

export async function POST(request: Request) {
  // Simple auth check — require API_SECRET header for non-dev environments
  const apiSecret = process.env.API_SECRET;
  if (apiSecret) {
    const provided = request.headers.get("x-api-secret");
    if (provided !== apiSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();

    // Single user mode
    if (body.userId && typeof body.userId === "string") {
      const result = await sendDailyQuestEmail(body.userId);
      return NextResponse.json({
        success: result.ok,
        ...result,
      });
    }

    // Batch mode — all users with pending quests
    if (body.all === true) {
      const results = await sendAllDailyQuestEmails();
      return NextResponse.json({
        success: true,
        ...results,
      });
    }

    return NextResponse.json(
      { error: "Provide { userId: string } or { all: true }" },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[daily-quest notification] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
