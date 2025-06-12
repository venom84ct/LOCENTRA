import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const ResidentMessagesPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profile_centra_resident")
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
    <DashboardLayout userType="centraResident" user={{ id: userId }}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <SimpleMessagingSystem
          userType="homeowner"
          userId={userId}
          userName={userName}
          userAvatar={userAvatar}
        />
      </div>
    </DashboardLayout>
  );
};

export default ResidentMessagesPage;
