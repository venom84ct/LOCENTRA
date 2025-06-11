// src/components/OneSignalInit.tsx
import { useEffect } from "react";

const OneSignalInit = () => {
  useEffect(() => {
    const loadOneSignal = () => {
      if (window.OneSignal) return;

      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      script.async = true;
      script.onload = () => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "akh4icftluagfcr3derrfq4yo",
            notifyButton: {
              enable: true,
            },
            promptOptions: {
              actionMessage: "Allow notifications for job updates and messages.",
              acceptButtonText: "Allow",
              cancelButtonText: "No thanks",
            },
            allowLocalhostAsSecureOrigin: true,
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
