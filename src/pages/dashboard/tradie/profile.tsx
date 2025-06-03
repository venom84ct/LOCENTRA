import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboard from "@/components/dashboard/TradieDashboard";

interface TradieProfile {
  name?: string;
  email?: string;
  avatar_url?: string;
  trade?: string;
  license?: string;
  abn?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  credits?: number;
  rewards_points?: number;
  rating_avg?: number;
  rating_count?: number;
  status?: string;
  portofolio?: string[];
  previousJobs?: { title: string }[];
}

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<TradieProfile | null>(null);
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

      if (error || !data) {
        console.error("❌ Failed to fetch tradie profile:", error?.message);
        setLoading(false);
        return;
      }

      // Parse fields safely
      const parsedPortfolio = Array.isArray(data.portofolio) ? data.portofolio : [];
      const parsedJobs = Array.isArray(data.previousJobs) ? data.previousJobs : [];

      setProfile({
        ...data,
        portofolio: parsedPortfolio,
        previousJobs: parsedJobs,
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
