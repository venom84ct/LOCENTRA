import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const TradieMessagesPage = () => {
  const mockTradie = {
    userType: "tradie", // ✅ fixed from "centraTradie"
    userId: "mock-tradie-id",
    userName: "Tradie McFixit",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fixit",
  };

  return (
    <DashboardLayout userType="tradie" user={mockTradie}>
      <SimpleMessagingSystem {...mockTradie} />
    </DashboardLayout>
  );
};

export default TradieMessagesPage;


