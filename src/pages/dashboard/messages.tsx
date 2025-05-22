import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const MessagesPage = () => {
  const location = useLocation();
  const messageId = new URLSearchParams(location.search).get("messageId");

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  useEffect(() => {
    if (messageId) {
      console.log(`Opening message with ID: ${messageId}`);
      // In a real app, this would load the specific message thread
    }
  }, [messageId]);

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>

          <SimpleMessagingSystem
            userType="centraResident"
            userId="user123"
            userName={user.name}
            userAvatar={user.avatar}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
