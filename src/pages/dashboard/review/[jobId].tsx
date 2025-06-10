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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndJob = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not found or error during auth.");
        setLoading(false);
        return;
      }

      setUser(user);

      if (!jobId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("title, assigned_tradie")
        .eq("id", jobId)
        .single();

      if (error || !data) {
        console.error("Error fetching job:", error);
      } else {
        setTradieId(data.assigned_tradie);
        setJobTitle(data.title);
      }

      setLoading(false);
    };

    fetchUserAndJob();
  }, [jobId]);

  if (loading || !jobId || !tradieId || !user) return <p>Loading...</p>;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="max-w-xl mx-auto p-6">
        <ReviewForm jobId={jobId} tradieId={tradieId} jobTitle={jobTitle} />
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
