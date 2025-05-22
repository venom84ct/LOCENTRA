import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CentraResidentDashboard from "@/components/dashboard/HomeownerDashboard";
import TradieDashboard from "@/components/dashboard/TradieDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"centraResident" | "tradie">(
    "centraResident",
  );

  useEffect(() => {
    // Check if userType was passed in location state (from login/register)
    if (location.state && location.state.userType) {
      setUserType(location.state.userType);
    }

    // Check if we're in a tradie-specific route
    if (location.pathname.includes("/tradie")) {
      setUserType("tradie");
    }

    // In a real app, this would check if the user is authenticated
    // For demo purposes, we'll just assume they are
    const isAuthenticated = true;

    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [location, navigate]);

  // Mock user data
  const mockUser = {
    name: userType === "centraResident" ? "John Smith" : "Mike Johnson",
    email:
      userType === "centraResident"
        ? "john.smith@example.com"
        : "mike.johnson@example.com",
    avatar:
      userType === "centraResident"
        ? "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        : "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    unreadMessages: 2,
    unreadNotifications: 3,
  };

  return (
    <DashboardLayout userType={userType} user={mockUser}>
      {userType === "centraResident" ? (
        <CentraResidentDashboard />
      ) : (
        <TradieDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
