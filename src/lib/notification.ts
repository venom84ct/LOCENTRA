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

export async function savePlayerId(playerId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const tables = ["profile_centra_resident", "profile_centra_tradie"];
  for (const table of tables) {
    await supabase
      .from(table)
      .update({ onesignal_player_id: playerId })
      .eq("id", user.id);
  }
}
