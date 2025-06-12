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
    const { userId, title, message } = await req.json();

    if (!userId || !title || !message) {
      throw new Error("userId, title and message are required");
    }

    const response = await fetch(
      "https://onesignal.com/api/v1/notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Deno.env.get("ONESIGNAL_API_KEY")}`,
        },
        body: JSON.stringify({
          app_id: Deno.env.get("ONESIGNAL_APP_ID"),
          include_external_user_ids: [userId],
          headings: { en: title },
          contents: { en: message },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : "Request failed");
    }

    return new Response(JSON.stringify({ success: true }), {
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
