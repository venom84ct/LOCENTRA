import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const MessagesPage = () => {
  // Mock user data
  const currentUser = {
    id: "homeowner1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  return (
    <DashboardLayout userType="centraResident" user={currentUser}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <SimpleMessagingSystem
          userType="centraResident"
          userId={currentUser.id}
          userName={currentUser.name}
          userAvatar={currentUser.avatar}
        />
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
