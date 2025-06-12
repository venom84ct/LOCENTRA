import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardMessaging from "@/components/messaging/DashboardMessaging";
import { supabase } from "@/lib/supabaseClient";

const TradieMessagesPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data);
    };
    load();
  }, []);

  if (!profile) return <div className="p-8">Loading messaging system...</div>;

  return (
    <DashboardLayout user={profile} userType="tradie">
      <DashboardMessaging userRole="tradie" profile={profile} />
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
