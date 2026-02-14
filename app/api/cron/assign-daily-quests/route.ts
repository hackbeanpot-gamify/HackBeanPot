/**
 * app/api/cron/assign-daily-quests/route.ts
 *
 * HTTP endpoint to trigger the daily quest assignment + email job.
 *
 * AUTHENTICATION:
 * Requires `x-cron-secret` header matching CRON_SECRET env var.
 * If CRON_SECRET is not set, endpoint is open (dev mode only).
 *
 * USAGE:
 *   curl -X POST http://localhost:3000/api/cron/assign-daily-quests \
 *     -H "x-cron-secret: impacttrail_cron_2025"
 *
 * VERCEL CRON (production):
 *   Add to vercel.json:
 *   { "crons": [{ "path": "/api/cron/assign-daily-quests", "schedule": "0 12 * * *" }] }
 */

import { NextResponse } from "next/server";
import { runDailyQuestJob } from "@/lib/jobs/runDailyQuestJob";

export async function POST(request: Request) {
  // ── Auth: verify cron secret ──
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = request.headers.get("x-cron-secret");
    if (provided !== cronSecret) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing x-cron-secret header." },
        { status: 401 }
      );
    }
  }

  // ── Run the job ──
  try {
    const result = await runDailyQuestJob();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/assign-daily-quests] Fatal:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
