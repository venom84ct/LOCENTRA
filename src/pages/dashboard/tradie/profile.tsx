import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboard from "@/components/dashboard/TradieDashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

  return (
    <DashboardLayout userType="tradie">
      <div className="p-4">
        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <TradieDashboard profile={profile} />
        ) : (
          <p className="text-red-600">Profile not found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
