// File: supabase/functions/reset_leaderboard/index.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1. Get top 5 tradies by score
  const { data: topTradies, error } = await supabase
    .from("profile_centra_tradie")
    .select("id")
    .order("score", { ascending: false })
    .limit(5);

  if (error || !topTradies) {
    return new Response(JSON.stringify({ error: error?.message || "Failed to fetch tradies" }), { status: 500 });
  }

  // 2. Award credits and badges
  const badgeCredits = [
    { id: topTradies[0]?.id, badge: "gold", credits: 25 },
    { id: topTradies[1]?.id, badge: "silver", credits: 20 },
    { id: topTradies[2]?.id, badge: "bronze", credits: 15 },
    { id: topTradies[3]?.id, badge: null, credits: 10 },
    { id: topTradies[4]?.id, badge: null, credits: 5 },
  ].filter(t => t.id);

  for (const { id, badge, credits } of badgeCredits) {
    // Increment credits via RPC
    const { error: creditError } = await supabase.rpc("increment_credits", {
      user_id: id,
      amount: credits,
    });

    if (creditError) {
      console.error(`Failed to increment credits for ${id}:`, creditError.message);
    }

    // Update badge if applicable
    if (badge) {
      await supabase
        .from("profile_centra_tradie")
        .update({ weekly_badge: badge })
        .eq("id", id);
    }
  }

  // 3. Reset score and badge for all others
  const { error: resetError } = await supabase
    .from("profile_centra_tradie")
    .update({ score: 0, weekly_badge: null })
    .not("id", "in", topTradies.map(t => t.id));

  if (resetError) {
    return new Response(JSON.stringify({ error: resetError.message }), { status: 500 });
  }

  return new Response("Leaderboard reset and rewards given", { status: 200 });
});

