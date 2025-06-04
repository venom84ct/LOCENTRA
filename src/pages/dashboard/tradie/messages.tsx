import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import MessagingSystem from "@/components/messaging/MessagingSystem";

const TradieMessagesPage = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profile_centra_tradie")
        .select("first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.first_name);
        setUserAvatar(profile.avatar_url || "");
      }
    };

    fetchUser();
  }, []);

  return (
    <DashboardLayout userType="tradie">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <MessagingSystem
          userType="tradie"
          userId={userId}
          userName={userName}
          userAvatar={userAvatar}
        />
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
