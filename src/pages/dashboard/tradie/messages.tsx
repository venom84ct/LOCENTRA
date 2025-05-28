import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import { useAuthUser } from "@/hooks/useAuthUser";

const TradieMessagesPage = () => {
  const { user, profile } = useAuthUser("tradie"); // assumes custom hook
  return (
    <DashboardLayout user={profile} userType="tradie">
      <MessagingSystem userId={user?.id} userType="tradie" />
    </DashboardLayout>
  );
};

export default TradieMessagesPage;

