/**
 * app/api/dailyQuest/page/route.ts
 *
 * GET /api/dailyQuest/page
 *
 * Returns everything the Quests tab needs:
 *   - Today's daily quest for Jackson (or null)
 *   - Any raid boss events Jackson has RSVP'd to
 *
 * Hardcoded to Jackson's email for demo.
 */

import { NextResponse } from "next/server";
import { getDailyQuestWithRsvps } from "@/lib/raidBoss/getDailyQuestWithRsvps";

/** Demo-hardcoded email */
const HARDCODED_EMAIL = "jacksonzheng425@gmail.com";

export async function GET() {
  try {
    const data = await getDailyQuestWithRsvps(HARDCODED_EMAIL);

    // Surface user-resolution errors as a 404
    if (data.userError) {
      return NextResponse.json({ error: data.userError }, { status: 404 });
    }

    return NextResponse.json({
      dailyQuest: data.dailyQuest,
      rsvpEvents: data.rsvpEvents,
    });
  } catch (err) {
    console.error("[GET /api/dailyQuest/page] Error:", err);
    return NextResponse.json({ error: "Failed to fetch daily quest page data" }, { status: 500 });
  }
}
