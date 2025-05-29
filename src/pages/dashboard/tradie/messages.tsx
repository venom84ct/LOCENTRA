import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BasicMessagingSystem from "@/components/messaging/BasicMessagingSystem";

const MessagesPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <BasicMessagingSystem userId={profile.id} userType="tradie" />
    </DashboardLayout>
  );
};

export default MessagesPage;

