import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import { supabase } from "@/lib/supabaseClient";

const MessagesPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <MessagingSystem user={profile} userType="centraResident" />
    </DashboardLayout>
  );
};

export default MessagesPage;
