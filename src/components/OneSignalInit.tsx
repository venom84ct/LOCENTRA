import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const OneSignalInit = () => {
  useEffect(() => {
    const initOneSignal = async () => {
      if (window.OneSignal) return;

      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      script.async = true;
      script.onload = async () => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "b6d82074-2797-435a-9586-63bc0b55a696", // Replace with your OneSignal App ID
            notifyButton: {
              enable: true,
            },
            allowLocalhostAsSecureOrigin: true,
            promptOptions: {
              actionMessage: "Enable push to receive job and message updates.",
              acceptButtonText: "Yes",
              cancelButtonText: "No",
            },
          });

          window.OneSignal.showSlidedownPrompt();

          window.OneSignal.getUserId().then(async (playerId) => {
            if (!playerId) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Try to update both resident and tradie tables
            await supabase
              .from("profile_centra_resident")
              .update({ onesignal_id: playerId })
              .eq("id", user.id);

            await supabase
              .from("profile_centra_tradie")
              .update({ onesignal_id: playerId })
              .eq("id", user.id);
          });
        });
      };
      document.head.appendChild(script);
    };

    initOneSignal();
  }, []);

  return null;
};

export default OneSignalInit;

