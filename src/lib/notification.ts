import { supabase } from "./supabaseClient";

export interface PushNotificationPayload {
  message: string;
  playerId?: string;
  segment?: string;
}

export async function sendPushNotification(payload: PushNotificationPayload) {
  const { data, error } = await supabase.functions.invoke(
    "send_push_notification",
    { body: payload },
  );

  if (error) throw new Error(error.message);
  return data;
}
