import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TradieMessagesPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tradieProfile, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching tradie profile:", error);
        return;
      }

      setProfile(tradieProfile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-8">Loading messaging system...</div>;

  return (
    <DashboardLayout user={profile} userType="centraTradie">
      <div className="p-4">
        <MessagingSystem user={profile} userType="tradie" />
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
