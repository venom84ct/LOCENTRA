import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true); // For demo purposes, set to true
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would check if the current user has admin privileges
    // For demo purposes, we'll simulate a check after a short delay
    const checkAdminStatus = async () => {
      try {
        // Simulate API call to check admin status
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For demo purposes, we're setting isAdmin to true
        // In a real app, this would be based on the user's role from authentication
        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect non-admin users
    navigate("/");
    return null;
  }

  return <AdminDashboard />;
};

export default AdminPage;
