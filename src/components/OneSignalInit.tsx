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
            appId: "b6d82074-2797-435a-9586-63bc0b55a696", // ✅ Your OneSignal App ID
            notifyButton: {
              enable: true,
            },
            promptOptions: {
              actionMessage: "Allow notifications to get job updates and messages.",
              acceptButtonText: "Allow",
              cancelButtonText: "No thanks",
            },
            allowLocalhostAsSecureOrigin: true,
          });

          // ✅ Link current user (if logged in) for targeting via OneSignal
          const userId = localStorage.getItem("userId"); // replace with actual ID logic if needed
          if (userId) {
            window.OneSignal.setExternalUserId(userId);
          }
        });
      };

      document.head.appendChild(script);
    };

    loadOneSignal();
  }, []);

  return null;
};

export default OneSignalInit;
