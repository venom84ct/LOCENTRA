
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CentraResidentDashboard from "@/components/dashboard/HomeownerDashboard";
import TradieDashboard from "@/components/dashboard/TradieDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileInitializer from "@/components/ProfileInitializer";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"centraResident" | "tradie">("centraResident");

  useEffect(() => {
    if (location.state && location.state.userType) {
      setUserType(location.state.userType);
    }

    if (location.pathname.includes("/tradie")) {
      setUserType("tradie");
    }

    const isAuthenticated = true;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [location, navigate]);

  const mockUser = {
    name: userType === "centraResident" ? "John Smith" : "Mike Johnson",
    email: userType === "centraResident"
      ? "john.smith@example.com"
      : "mike.johnson@example.com",
    avatar: userType === "centraResident"
      ? "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      : "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  return (
    <DashboardLayout userType={userType} user={mockUser}>
      <ProfileInitializer />
      {userType === "centraResident" ? (
        <CentraResidentDashboard />
      ) : (
        <TradieDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
