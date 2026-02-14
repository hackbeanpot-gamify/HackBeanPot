// API: GET /api/leaderboard — city-wide leaderboard
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cityLeaderboard')
    .select("*")
    .order('xp', {ascending: false});

    if (error) {
      return NextResponse.json({error: error.message }, { status: 500 });
    }

    return NextResponse.json(data)
}