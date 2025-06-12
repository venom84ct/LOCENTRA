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
      if (!user?.id) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Failed to fetch tradie profile:", profileError);
        return;
      }

      setProfile(profileData);

      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (jobError || !jobData) {
        console.error("Failed to fetch job:", jobError);
        return;
      }

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
      alert("You do not have enough credits.");
      return;
    }

    // Check if tradie already assigned
    if (job.tradie_id) {
      alert("This job has already been assigned to another tradie.");
      return;
    }

    // Update job with tradie_id
    const { error: jobUpdateError } = await supabase
      .from("jobs")
      .update({ tradie_id: profile.id })
      .eq("id", job.id);

    if (jobUpdateError) {
      alert("Failed to assign the job.");
      return;
    }

    // Deduct credits
    const { error: creditError } = await supabase
      .from("profile_centra_tradie")
      .update({ credits: updatedCredits })
      .eq("id", profile.id);

    if (creditError) {
      alert("Failed to deduct credits.");
      return;
    }

    // Check if conversation already exists
    const { data: existingConvo, error: convoError } = await supabase
      .from("conversations")
      .select("id")
      .eq("job_id", job.id)
      .eq("tradie_id", profile.id)
      .maybeSingle();

    if (convoError && convoError.code !== "PGRST116") {
      console.error("Failed to fetch conversation:", convoError);
      return;
    }

    if (!existingConvo) {
      await supabase.from("conversations").insert([
        {
          job_id: job.id,
          homeowner_id: job.homeowner_id,
          tradie_id: profile.id,
        },
      ]);
    }

    alert("Lead purchased. You can now message the homeowner.");
    navigate("/dashboard/tradie/my-jobs");
  };

  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                <Badge variant="destructive" className="text-xs">
                  Emergency
                </Badge>
              )}
              {renderStatus(job.status)}
            </div>
          </div>

          {/* Job Image */}
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
            <Button variant="default" onClick={handlePurchaseLead}>
              Purchase Lead ({job.is_emergency ? 10 : 5} credits)
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPreviewPage;
