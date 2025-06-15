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
    console.warn("VITE_ONESIGNAL_APP_ID is not set; OneSignal will not be initialised");
  }

  useEffect(() => {
    const loadOneSignal = () => {
      if (window.OneSignal) return;
      if (!appId) return; // do not attempt to load when appId is missing

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

        });
      };

      document.head.appendChild(script);
    };

    if (appId) {
      loadOneSignal();
    }
  }, []);

  useEffect(() => {
    const promptIfNeeded = async () => {
      try {
        const enabled = await window.OneSignal.isPushNotificationsEnabled();
        if (!enabled) {
          await window.OneSignal.showSlidedownPrompt();
        }
      } catch (e) {
        console.warn("Prompt error:", e);
      }
    };

    if (window.OneSignal && typeof window.OneSignal.push === 'function') {
      window.OneSignal.push(promptIfNeeded);
    } else {
      const interval = setInterval(() => {
        if (window.OneSignal && typeof window.OneSignal.push === 'function') {
          clearInterval(interval);
          window.OneSignal.push(promptIfNeeded);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return null;
};

export default OneSignalInit;
