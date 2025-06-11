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
            appId: "b6d82074-2797-435a-9586-63bc0b55a696",
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
