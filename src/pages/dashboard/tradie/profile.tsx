// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboard from "@/components/dashboard/tradiedashboard";

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

      // Ensure portfolio is always an array
      const parsedPortfolio = Array.isArray(data.portofolio)
        ? data.portofolio
        : [];

      setProfile({
        ...data,
        portofolio: parsedPortfolio,
        previousJobs: data.previousJobs || [], // Optional: handle if this is stored
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return <TradieDashboard profile={profile} />;
};

export default TradieProfilePage;
