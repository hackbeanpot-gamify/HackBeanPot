/**
 * app/api/cron/email-daily-quests/route.ts
 *
 * HTTP endpoint to trigger the daily quest email job.
 *
 * AUTHENTICATION:
 *   Requires `x-cron-secret` header matching CRON_SECRET env var.
 *   If CRON_SECRET is not set, endpoint is open (dev mode only).
 *
 * USAGE (local):
 *   curl -X POST http://localhost:3000/api/cron/email-daily-quests \
 *     -H "x-cron-secret: impacttrail_cron_2025"
 *
 * VERCEL CRON (production):
 *   Add to vercel.json:
 *   {
 *     "crons": [{
 *       "path": "/api/cron/email-daily-quests",
 *       "schedule": "0 13 * * *"
 *     }]
 *   }
 *   (0 13 * * * = 1pm UTC = 9am ET / 8am ET during DST)
 *
 * GITHUB ACTIONS (alternative):
 *   name: Daily Quest Email
 *   on:
 *     schedule:
 *       - cron: '0 13 * * *'
 *   jobs:
 *     trigger:
 *       runs-on: ubuntu-latest
 *       steps:
 *         - run: |
 *             curl -X POST https://yourapp.vercel.app/api/cron/email-daily-quests \
 *               -H "x-cron-secret: ${{ secrets.CRON_SECRET }}"
 */

import { NextResponse } from "next/server";
import { runDailyQuestEmailJob } from "@/lib/jobs/runDailyQuestEmailJob";

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
    const result = await runDailyQuestEmailJob();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/email-daily-quests] Fatal:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
