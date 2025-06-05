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

  // 2. Award badges
  const badgeUpdates = [
    { id: topTradies[0]?.id, badge: "gold" },
    { id: topTradies[1]?.id, badge: "silver" },
    { id: topTradies[2]?.id, badge: "bronze" },
  ].filter(t => t.id);

  for (const { id, badge } of badgeUpdates) {
    await supabase
      .from("profile_centra_tradie")
      .update({ weekly_badge: badge })
      .eq("id", id);
  }

  // 3. Reset scores
  const { error: resetError } = await supabase
    .from("profile_centra_tradie")
    .update({ score: 0 });

  if (resetError) {
    return new Response(JSON.stringify({ error: resetError.message }), { status: 500 });
  }

  return new Response("Leaderboard reset successfully", { status: 200 });
});
