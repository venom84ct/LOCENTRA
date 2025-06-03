import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/dashboard";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const MessagesPage = () => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("id, first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading resident profile", error.message);
        return;
      }

      setUserProfile({
        userType: "centraResident",
        userId: data.id,
        userName: data.first_name,
        userAvatar: data.avatar_url,
      });
    };

    loadUserProfile();
  }, []);

  if (!userProfile) return <div className="p-4">Loading...</div>;

  return (
    <DashboardLayout userType="centraResident" user={userProfile}>
      <SimpleMessagingSystem
        userType={userProfile.userType}
        userId={userProfile.userId}
        userName={userProfile.userName}
        userAvatar={userProfile.userAvatar}
      />
    </DashboardLayout>
  );
};

export default MessagesPage;
