// src/components/OneSignalInit.tsx
import { useEffect } from "react";
import { savePlayerId } from "@/lib/notification";

declare global {
  interface Window {
    OneSignal: any;
  }
}

const OneSignalInit = () => {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  if (!appId) {
    console.warn("VITE_ONESIGNAL_APP_ID is not set");
  }

  useEffect(() => {
    const loadOneSignal = () => {
      if (window.OneSignal) return;

      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      script.async = true;

      script.onload = () => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(function () {
          window.OneSignal.init({
            appId: appId,
            notifyButton: {
              enable: true,
            },
            allowLocalhostAsSecureOrigin: true,
            promptOptions: {
              actionMessage: "Would you like to receive notifications for messages and job updates?",
              acceptButtonText: "Yes",
              cancelButtonText: "No",
            },
          });

          window.OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
            if (isSubscribed) {
              try {
                const id = await window.OneSignal.getUserId();
                if (id) {
                  await savePlayerId(id);
                }
              } catch (err) {
                console.error('Failed to save OneSignal player ID', err);
              }
            }
          });

          // Optionally prompt the user manually (or remove this block if you only want auto-prompt)
          window.OneSignal.showSlidedownPrompt().catch((e: any) => {
            console.warn("Prompt error:", e);
          });
        });
      };

      document.head.appendChild(script);
    };

    loadOneSignal();
  }, []);

  return null;
};

export default OneSignalInit;
