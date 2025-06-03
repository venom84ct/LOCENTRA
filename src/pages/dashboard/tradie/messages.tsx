import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TradieDashboardLayout from "@/components/layout/TradieDashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const TradieMessagesPage = () => {
  const [userInfo, setUserInfo] = useState<{
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
        console.error("Failed to fetch user:", error?.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profile_centra_tradie")
        .select("first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile:", profileError.message);
        return;
      }

      setUserInfo({
        userId: user.id,
        userName: profile.first_name,
        userAvatar: profile.avatar_url,
      });
    };

    fetchUser();
  }, []);

  if (!userInfo) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <TradieDashboardLayout>
      <SimpleMessagingSystem
        userType="tradie"
        userId={userInfo.userId}
        userName={userInfo.userName}
        userAvatar={userInfo.userAvatar}
      />
    </TradieDashboardLayout>
  );
};

export default TradieMessagesPage;

