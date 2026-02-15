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
import { getUserByEmail } from "@/lib/raidBoss/getUserByEmail";
import { createRsvp } from "@/lib/raidBoss/createRsvp";

/** Demo-hardcoded email — all RSVPs are created for this user */
const HARDCODED_EMAIL = "jacksonzheng425@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId } = body;

    // Validate input
    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    // Resolve user by hardcoded email
    const userId = await getUserByEmail(HARDCODED_EMAIL);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert RSVP (idempotent)
    const success = await createRsvp(eventId, userId, "going");
    if (!success) {
      return NextResponse.json({ error: "Failed to create RSVP" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/raidBoss/rsvp] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
