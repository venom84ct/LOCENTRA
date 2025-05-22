import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const TradieMessagesPage = () => {
  // Mock user data
  const currentUser = {
    id: "tradie1",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  return (
    <DashboardLayout userType="tradie" user={currentUser}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <SimpleMessagingSystem
          userType="tradie"
          userId={currentUser.id}
          userName={currentUser.name}
          userAvatar={currentUser.avatar}
        />
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
