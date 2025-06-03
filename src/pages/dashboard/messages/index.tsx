import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const MessagesPage = () => {
  return (
    <DashboardLayout userType="resident">
      <SimpleMessagingSystem />
    </DashboardLayout>
  );
};

export default MessagesPage;
