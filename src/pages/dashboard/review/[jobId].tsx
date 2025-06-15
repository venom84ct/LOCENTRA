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
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      const userId = authUser?.id;
      if (authError || !userId) {
        console.error("User not found or error during auth.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", userId)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      setUser(profile);

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
      <div className="max-w-xl mx-auto">
        <ReviewForm jobId={jobId} tradieId={tradieId} jobTitle={jobTitle} />
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
