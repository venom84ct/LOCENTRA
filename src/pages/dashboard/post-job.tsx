import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostJobForm from "@/components/jobs/PostJobForm";

const PostJobDashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="max-w-2xl mx-auto py-8">
        <PostJobForm />
      </div>
    </DashboardLayout>
  );
};

export default PostJobDashboardPage;
