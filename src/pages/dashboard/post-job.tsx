import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostJobForm from "@/components/jobs/PostJobForm";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const PostJobPage = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostJobForm />
      </div>
    </DashboardLayout>
  );
};

export default PostJobPage;
