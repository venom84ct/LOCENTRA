import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CentraResidentDashboard from "@/components/dashboard/HomeownerDashboard";
import TradieDashboard from "@/components/dashboard/TradieDashboard";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<"centraResident" | "tradie" | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;

      if (!userId) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching profile:", error);
        navigate("/login");
        return;
      }

      setUser(data);
      setUserType(data.role === "tradie" ? "tradie" : "centraResident");
      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!userType || !user) return <div className="p-8 text-red-600">Unable to load user.</div>;

  return (
    <DashboardLayout userType={userType} user={user}>
      {userType === "tradie" ? <TradieDashboard /> : <CentraResidentDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
