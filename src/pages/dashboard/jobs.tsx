import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DashboardJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [reviewedJobs, setReviewedJobs] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        profile_centra_resident(first_name, avatar_url),
        profile_centra_tradie!assigned_tradie(first_name, last_name),
        job_leads(id, tradie_id, profile_centra_tradie(first_name, last_name))
      `)
      .eq("homeowner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setJobs(data || []);
    }

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("job_id")
      .eq("homeowner_id", user.id);

    setReviewedJobs(reviewsData?.map((r: any) => r.job_id) || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCancelJob = async (jobId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "cancelled" })
      .eq("id", jobId);

    if (!error) {
      fetchJobs();
    }
  };

  const handleAssignTradie = async (jobId: string, tradieId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ assigned_tradie: tradieId })
      .eq("id", jobId);

    if (!error) {
      const { data: jobData } = await supabase
        .from("jobs")
        .select("title")
        .eq("id", jobId)
        .single();

      const jobTitle = jobData?.title || "a job";

      await supabase.from("notifications").insert({
        recipient_id: tradieId,
        recipient_type: "tradie",
        description: `You have been assigned to a new job: "${jobTitle}".`,
        type: "success",
        related_id: jobId,
        related_type: "job",
      });

      fetchJobs();
    }
  };

  const handleMarkComplete = async (jobId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "completed" })
      .eq("id", jobId);

    if (!error) {
      fetchJobs();
    }
  };

  const goToReviewPage = (jobId: string) => {
    navigate(`/dashboard/review/${jobId}`);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>
        {jobs
          .filter((job) => {
            const isCancelled = job.status === "cancelled";
            const isReviewed = reviewedJobs.includes(job.id);
            const isCompleted = job.status === "completed";
            return !isCancelled && !(isCompleted && isReviewed);
          })
          .map((job) => {
            const isAssigned = !!job.assigned_tradie;
            const isCompleted = job.status === "completed";
            const isEmergency = job.is_emergency;
            const assignedTradie = job.profile_centra_tradie;
            const tradieOptions = job.job_leads || [];
            const hasReview = reviewedJobs.includes(job.id);
            const awaitingReview = isCompleted && !hasReview;

            return (
              <Card
                key={job.id}
                className={`p-4 ${
                  isAssigned ? "bg-[#CAEEC2]" : "bg-white"
                } ${isEmergency ? "border-red-500 border-2" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {job.title}
                      {isEmergency && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                    </div>
                    {awaitingReview ? (
                      <Badge className="bg-yellow-500 text-white">Awaiting Review</Badge>
                    ) : isCompleted ? (
                      <Badge className="bg-green-700 text-white">Reviewed</Badge>
                    ) : isAssigned ? (
                      <Badge variant="outline">In Progress</Badge>
                    ) : (
                      <Badge variant="secondary">Open for Quotes</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Budget: ${job.budget} | Location: {job.location} | Timeline: {job.timeline}
                  </div>

                  {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {job.image_urls
                        .filter((url: string) => typeof url === "string" && url.startsWith("http"))
                        .map((url: string, idx: number) => (
                          <a key={idx} href={url} target="_blank" rel="noreferrer">
                            <img
                              src={url}
                              className="w-full h-24 object-cover rounded"
                              alt={`Job image ${idx + 1}`}
                            />
                          </a>
                        ))}
                    </div>
                  )}

                  {isAssigned && assignedTradie && (
                    <p className="text-sm text-green-800 font-medium">
                      Assigned to: {assignedTradie.first_name} {assignedTradie.last_name}
                    </p>
                  )}

                  {!isAssigned && tradieOptions.length > 0 && (
                    <div className="mt-3">
                      <label className="text-sm font-medium mr-2">Assign Tradie:</label>
                      <select
                        onChange={(e) => handleAssignTradie(job.id, e.target.value)}
                        defaultValue=""
                        className="border rounded p-1"
                      >
                        <option value="" disabled>Select tradie</option>
                        {tradieOptions.map((lead: any) => (
                          <option key={lead.tradie_id} value={lead.tradie_id}>
                            {lead.profile_centra_tradie.first_name} {lead.profile_centra_tradie.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!isAssigned && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="default"
                        onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Job
                      </Button>
                    </div>
                  )}

                  {isAssigned && !isCompleted && (
                    <div className="mt-3">
                      <Button variant="success" onClick={() => handleMarkComplete(job.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}

                  {awaitingReview && (
                    <div className="mt-3">
                      <Button variant="default" onClick={() => goToReviewPage(job.id)}>
                        <Star className="w-4 h-4 mr-2" />
                        Leave a Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
