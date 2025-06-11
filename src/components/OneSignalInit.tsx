// src/components/OneSignalInit.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const OneSignalInit = () => {
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load SDK
      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      script.async = true;
      script.onload = () => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "b6d82074-2797-435a-9586-63bc0b55a696",
            notifyButton: { enable: true },
            allowLocalhostAsSecureOrigin: true,
          });

          // This is REQUIRED to identify the user for push delivery
          window.OneSignal.setExternalUserId(user.id);
        });
      };
      document.head.appendChild(script);
    };

    init();
  }, []);

  return null;
};

export default OneSignalInit;
