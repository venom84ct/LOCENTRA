import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Function to get current AWST time
function isMidnightSundayInAWST() {
  const nowUTC = new Date();
  const nowAWST = new Date(nowUTC.getTime() + 8 * 60 * 60 * 1000); // UTC+8
  return nowAWST.getUTCDay() === 0 && nowAWST.getUTCHours() === 0 && nowAWST.getUTCMinutes() === 0;
}

serve(async () => {
  // Only proceed if current AWST time is Sunday midnight
  if (!isMidnightSundayInAWST()) {
    return new Response("Not the scheduled time in AWST.", { status: 200 });
  }

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
    // Add credits
    const { error: creditError } = await supabase.rpc("increment_credits", {
      user_id: id,
      amount: credits,
    });

    if (creditError) {
      console.error(`Failed to add credits for ${id}:`, creditError.message);
    }

    // Assign badge
    if (badge) {
      await supabase
        .from("profile_centra_tradie")
        .update({ weekly_badge: badge })
        .eq("id", id);
    }
  }

  // 3. Reset scores and badges for others
  const { error: resetError } = await supabase
    .from("profile_centra_tradie")
    .update({ score: 0, weekly_badge: null })
    .not("id", "in", topTradies.map((t) => t.id));

  if (resetError) {
    return new Response(JSON.stringify({ error: resetError.message }), { status: 500 });
  }

  return new Response("Leaderboard reset and rewards granted.", { status: 200 });
});
