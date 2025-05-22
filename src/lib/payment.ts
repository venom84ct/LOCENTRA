import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createPaymentIntent(
  amount: number,
  description?: string,
): Promise<PaymentIntentResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-create_payment_intent",
      {
        body: { amount, currency: "aud", description },
      },
    );

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}
