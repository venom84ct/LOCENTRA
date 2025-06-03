import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SimpleMessagingSystem from "@/components/messaging/SimpleMessagingSystem";

const MessagesPage = () => {
  const [userType, setUserType] = useState<"centraResident" | "tradie">("centraResident");
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

      // Try fetching as a resident
      const { data: residentProfile } = await supabase
        .from("profile_centra_resident")
        .select("first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (residentProfile) {
        setUserName(residentProfile.first_name);
        setUserAvatar(residentProfile.avatar_url || "");
        setUserType("centraResident");
        return;
      }

      // Try fetching as a tradie
      const { data: tradieProfile } = await supabase
        .from("profile_centra_tradie")
        .select("first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (tradieProfile) {
        setUserName(tradieProfile.first_name);
        setUserAvatar(tradieProfile.avatar_url || "");
        setUserType("tradie");
      }
    };

    fetchUser();
  }, []);

  return (
    <DashboardLayout userType={userType}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <SimpleMessagingSystem
          userType={userType}
          userId={userId}
          userName={userName}
          userAvatar={userAvatar}
        />
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
