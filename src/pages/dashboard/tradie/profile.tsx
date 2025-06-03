// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TradieDashboard from "@/components/dashboard/TradieDashboard";
import EditTradieProfile from "@/components/dashboard/EditTradieProfile";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

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
      console.error("❌ Failed to fetch profile:", error.message);
      setLoading(false);
      return;
    }

    setProfile({
      ...data,
      portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (updatedProfile: any) => {
    const { error } = await supabase
      .from("profile_centra_tradie")
      .update({
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        phone: updatedProfile.phone,
        trade: updatedProfile.trade,
        abn: updatedProfile.abn,
        license: updatedProfile.license,
        address: updatedProfile.address,
        avatar_url: updatedProfile.avatar_url,
        portfolio: updatedProfile.portfolio,
        bio: updatedProfile.bio,
      })
      .eq("id", updatedProfile.id);

    if (error) {
      console.error("❌ Failed to save profile:", error.message);
      alert("Failed to save profile changes.");
      return;
    }

    setEditing(false);
    fetchProfile(); // Re-fetch to update state
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-4">
        {editing ? (
          <EditTradieProfile
            profile={profile}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <TradieDashboard profile={profile} onEdit={() => setEditing(true)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
