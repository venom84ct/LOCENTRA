// src/pages/dashboard/tradie/index.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TradieDashboard from "@/components/dashboard/TradieDashboard";

const TradieDashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndJobs = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User fetch error:", userError);
        setLoading(false);
        return;
      }

      // Fetch tradie profile
      const { data: profileData, error: profileError } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Profile fetch error:", profileError);
        setLoading(false);
        return;
      }

      // Fetch jobs assigned to this tradie
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("status")
        .eq("assigned_tradie", user.id);

      if (jobError) {
        console.error("Job fetch error:", jobError);
      }

      setProfile({
        ...profileData,
        jobs: jobData || [],
      });

      setLoading(false);
    };

    fetchProfileAndJobs();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <TradieDashboard profile={profile} />
    </DashboardLayout>
  );
};

export default TradieDashboardPage;
