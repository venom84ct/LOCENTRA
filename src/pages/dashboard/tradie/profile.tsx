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

      // Normalize portfolio spelling and type
      const parsedPortfolio = Array.isArray(data.portfolio || data.portofolio)
        ? data.portfolio || data.portofolio
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return <TradieDashboard profile={profile} />;
};

export default TradieProfilePage;

