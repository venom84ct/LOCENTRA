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

      try {
        // Attempt to fetch tradie profile
        const { data: tradieProfile, error: tradieError } = await supabase
          .from("profile_centra_tradie")
          .select("*")
          .eq("id", userId)
          .single();

        if (tradieProfile) {
          setUser(tradieProfile);
          setUserType("tradie");
          return;
        }

        // Attempt to fetch homeowner profile
        const { data: residentProfile, error: residentError } = await supabase
          .from("profile_centra_resident")
          .select("*")
          .eq("id", userId)
          .single();

        if (residentProfile) {
          setUser(residentProfile);
          setUserType("centraResident");
          return;
        }

        // If neither profile is found, redirect to login
        console.error("User not found in either profile table.");
        navigate("/login");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!userType || !user) return <div className="p-8 text-red-600">Unable to load user.</div>;

  return (
    <DashboardLayout userType={userType} user={user}>
      {userType === "tradie" ? <TradieDashboard profile={user} /> : <CentraResidentDashboard profile={user} />}
    </DashboardLayout>
  );
};

export default Dashboard;


