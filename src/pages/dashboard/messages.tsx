import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const TradieMessagesPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="tradie">
      <MessagingSystem user={profile} userType="tradie" />
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
