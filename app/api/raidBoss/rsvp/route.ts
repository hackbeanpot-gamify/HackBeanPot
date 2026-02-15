/**
 * app/api/raidBoss/rsvp/route.ts
 *
 * POST /api/raidBoss/rsvp
 *
 * Creates or updates an RSVP for a raid boss event.
 * Hardcoded to resolve Jackson's user by email for demo.
 *
 * Request body: { eventId: string }
 * Response:     { success: true } or { error: string }
 */

import { NextResponse } from "next/server";
import { createRsvp } from "@/lib/raidBoss/createRsvp";

/** Demo-hardcoded user ID — all RSVPs are created for this user */
const HARDCODED_USER_ID = "57d33940-2603-474d-b084-285aaf859a0e";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId } = body;

    // Validate input
    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    // Upsert RSVP (idempotent) using hardcoded user ID
    const success = await createRsvp(eventId, HARDCODED_USER_ID, "going");
    if (!success) {
      return NextResponse.json({ error: "Failed to create RSVP" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/raidBoss/rsvp] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
