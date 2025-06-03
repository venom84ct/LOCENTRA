// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboard from "@/components/dashboard/tradiedashboard";
import DashboardLayout from "@/components/layout/tradiedashboard"; // Make sure this is the correct import

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ Failed to get user:", userError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ Failed to fetch tradie profile:", error.message);
        setLoading(false);
        return;
      }

      const parsedPortfolio = Array.isArray(data.portfolio)
        ? data.portfolio
        : [];

      setProfile({
        ...data,
        portfolio: parsedPortfolio,
        previousJobs: data.previousJobs || [],
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <DashboardLayout><div className="p-6">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div className="p-6 text-red-600">Profile not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <TradieDashboard profile={profile} />
    </DashboardLayout>
  );
};

export default TradieProfilePage;
