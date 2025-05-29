import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin, Clock } from "lucide-react";

const JobPreviewPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      setJob(jobData);
      setLoading(false);
    };

    fetchJobDetails();
  }, [id]);

  const handlePurchaseLead = async () => {
    if (!job || !profile) return;

    const leadCost = job.is_emergency ? 10 : 5;
    const updatedCredits = profile.credits - leadCost;

    if (updatedCredits < 0) {
      alert("Not enough credits");
      return;
    }

    // Assign tradie to job
    const { error: jobUpdateError } = await supabase
      .from("jobs")
      .update({ tradie_id: profile.id })
      .eq("id", job.id);

    if (jobUpdateError) {
      alert("Failed to assign job.");
      return;
    }

    // Deduct tradie's credits
    await supabase
      .from("profile_centra_tradie")
      .update({ credits: updatedCredits })
      .eq("id", profile.id);

    // Create conversation
    await supabase.from("conversations").insert([
      {
        job_id: job.id,
        homeowner_id: job.homeowner_id,
        tradie_id: profile.id,
      },
    ]);

    alert("Lead purchased. You can now message the homeowner.");
    navigate("/dashboard/tradie/my-jobs");
  };

  if (loading) return <div className="p-8">Loading job...</div>;
  if (!job) return <div className="p-8 text-red-600">Job not found.</div>;

  return (
    <DashboardLayout user={profile} userType="tradie">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">{job.title}</h1>

        <div
          className={`bg-white rounded-xl border shadow-sm p-6 space-y-4 ${
            job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm text-muted-foreground">{job.category}</p>
            <div className="flex flex-col items-end space-y-1">
              {job.is_emergency && (
                <Badge variant="destructive" className="text-xs">Emergency</Badge>
              )}
              <Badge>{job.status}</Badge>
            </div>
          </div>

          {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
            <a
              href={job.image_urls[0]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={job.image_urls[0]}
                alt="Job"
                className="w-full h-48 object-cover rounded-md border"
              />
            </a>
          )}

          <p className="text-sm">{job.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {job.budget}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {job.timeline}
            </div>
          </div>

          <div className="pt-4">
            <Button variant="success" onClick={handlePurchaseLead}>
              Purchase Lead ({job.is_emergency ? 10 : 5} credits)
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPreviewPage;
