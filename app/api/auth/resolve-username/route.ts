import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/resolve-username
 *
 * Resolves a display name (username) to an email address from the profiles table.
 *
 * Body: { "username": "johndoe" }
 * Returns: { "email": "john@example.com" } or 404 if not found.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { username } = body;

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("display_name", username)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No user found with that username" },
      { status: 404 }
    );
  }

  return NextResponse.json({ email: data.email });
}
