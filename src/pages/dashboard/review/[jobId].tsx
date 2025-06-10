import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";

const ReviewJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [job, setJob] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileAndJob = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: jobData } = await supabase
        .from("jobs")
        .select("id, title, assigned_tradie")
        .eq("id", jobId)
        .single();

      setProfile({ ...profileData, email: user.email });
      setJob(jobData);
    };

    fetchProfileAndJob();
  }, [jobId]);

  const handleSubmit = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }

    if (!job?.assigned_tradie) {
      alert("This job has no assigned tradie.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      job_id: job.id,
      tradie_id: job.assigned_tradie,
      homeowner_id: profile.id, // needed for RLS
      reviewer_id: profile.id,
      reviewer_name: profile.email || "Anonymous",
      rating,
      comment,
    });

    setSubmitting(false);

    if (error) {
      console.error(error);
      alert("Failed to submit review.");
    } else {
      alert("Review submitted successfully!");
      navigate("/dashboard");
    }
  };

  if (!profile || !job) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review for: {job.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Rating (1 to 5)</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Comment (optional)</label>
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewJobPage;
