// src/pages/dashboard/review/[jobId].tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReviewForm from "@/components/reviews/ReviewForm";

const ReviewPage = () => {
  const { jobId } = useParams();
  const [tradieId, setTradieId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndJob = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (!jobId) return;
      const { data, error } = await supabase
        .from("jobs")
        .select("title, assigned_tradie")
        .eq("id", jobId)
        .single();

      if (!error && data) {
        setTradieId(data.assigned_tradie);
        setJobTitle(data.title);
      }
    };

    fetchUserAndJob();
  }, [jobId]);

  if (!jobId || !tradieId || !user) return <p>Loading...</p>;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="max-w-xl mx-auto">
        <ReviewForm jobId={jobId} tradieId={tradieId} jobTitle={jobTitle} />
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
