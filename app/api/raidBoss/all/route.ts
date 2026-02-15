/**
 * app/api/raidBoss/all/route.ts
 *
 * GET /api/raidBoss/all
 *
 * Returns all raid boss events from the raidBossEvent table,
 * regardless of status. Used for the Boss Quests tent.
 */

import { NextResponse } from "next/server";
import { getAllRaidBossEvents } from "@/lib/raidBoss/getAllRaidBossEvents";

export async function GET() {
  try {
    const events = await getAllRaidBossEvents();

    return NextResponse.json({ events });
  } catch (err) {
    console.error("[GET /api/raidBoss/all] Error:", err);
    return NextResponse.json({ error: "Failed to fetch raid boss events" }, { status: 500 });
  }
}
