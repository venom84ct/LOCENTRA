import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency = "aud", description } = await req.json();

    if (!amount || amount < 50) {
      // Minimum $0.50 USD
      throw new Error("Amount must be at least 50 cents");
    }

    const url = "https://api.picaos.com/v1/passthrough/payment_intents";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
      "x-pica-connection-key": Deno.env.get("PICA_STRIPE_CONNECTION_KEY") || "",
      "x-pica-action-id": "conn_mod_def::GCmOAuPP5MQ::O0MeKcobRza5lZQrIkoqBA",
    };

    const params = new URLSearchParams();
    params.append("amount", amount.toString());
    params.append("currency", currency);

    if (description) {
      params.append("description", description);
    }

    // Enable automatic payment methods for better checkout experience
    params.append("automatic_payment_methods[enabled]", "true");

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Payment intent creation failed: ${data.error?.message || "Unknown error"}`,
      );
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
