import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessagingSystem from "@/components/messaging/MessagingSystem";
import { supabase } from "@/lib/supabaseClient";

const MessagesPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUser(profile);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-4">Loading conversations...</div>;

  if (!user) return <div className="p-4">You must be logged in to view messages.</div>;

  return (
    <DashboardLayout user={user} userType="centraResident">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <MessagingSystem user={user} />
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
