
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import { supabase } from "@/lib/supabaseClient";

const TradieMessagesPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setUser(profile);
    };

    getProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout user={user} userType="tradie">
      <MessagingSystem user={user} userType="tradie" />
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
