import React from "react";
import TradieSidebar from "@/components/layout/TradieSidebar";
import MessagingSystem from "@/components/messaging/MessagingSystem";

const TradieMessagesPage = () => {
  return (
    <div className="flex min-h-screen">
      <TradieSidebar />
      <main className="flex-1 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <MessagingSystem userType="tradie" />
      </main>
    </div>
  );
};

export default TradieMessagesPage;

