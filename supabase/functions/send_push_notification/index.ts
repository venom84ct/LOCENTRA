import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, playerId, segment } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    const restApiKey = Deno.env.get("ONESIGNAL_REST_API_KEY");
    if (!restApiKey) {
      throw new Error("Missing OneSignal REST API key");
    }

    const payload: Record<string, unknown> = {
      app_id: "b6d82074-2797-435a-9586-63bc0b55a696",
      contents: { en: message },
    };

    if (playerId) {
      payload.include_player_ids = [playerId];
    } else if (segment) {
      payload.included_segments = [segment];
    } else {
      throw new Error("playerId or segment is required");
    }

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${restApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0] || "Failed to send notification");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
