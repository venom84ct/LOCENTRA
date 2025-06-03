// src/pages/dashboard/tradie/messages/index.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboardLayout from "@/components/layout/TradieDashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const TradieMessagesPage = () => {
  const [userData, setUserData] = useState<{
    userId: string;
    userName: string;
    userAvatar: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("❌ Failed to fetch user:", error?.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profile_centra_tradie")
        .select("id, first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("❌ Failed to load tradie profile:", profileError?.message);
        return;
      }

      setUserData({
        userId: profile.id,
        userName: profile.first_name,
        userAvatar: profile.avatar_url || "",
      });
    };

    fetchUser();
  }, []);

  if (!userData) return <div className="p-6">Loading messages...</div>;

  return (
    <TradieDashboardLayout>
      <SimpleMessagingSystem
        userType="tradie"
        userId={userData.userId}
        userName={userData.userName}
        userAvatar={userData.userAvatar}
      />
    </TradieDashboardLayout>
  );
};

export default TradieMessagesPage;
