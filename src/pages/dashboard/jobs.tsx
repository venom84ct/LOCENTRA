// File: src/pages/dashboard/jobs.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  User,
  Plus,
  AlertCircle,
} from "lucide-react";

const DashboardJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  const refetchJobs = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from("profile_centra_resident")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      console.error("\u274C Failed to fetch profile:", profileError?.message);
      return;
    }

    setProfile(profileData);

    const { data: jobsData, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .eq("homeowner_id", profileData.id)
      .order("created_at", { ascending: false });

    if (jobsError) {
      console.error("\u274C Failed to fetch jobs:", jobsError.message);
    }

    const visibleJobs = (jobsData || []).filter(
      (j) =>
        j.status !== "cancelled" &&
        !(j.status === "completed" && j.review_submitted === true)
    );

    setJobs(visibleJobs);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await refetchJobs(user.id);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (jobId: string, newStatus: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus.toLowerCase() })
      .eq("id", jobId)
      .eq("homeowner_id", user.id);

    if (error) {
      console.error("\u274C Failed to update job:", error.message);
    } else {
      if (newStatus === "completed") {
        navigate(`/dashboard/review/${jobId}`);
      } else {
        await refetchJobs(user.id);
      }
    }
  };

  const renderStatusLabel = (job: any) => {
    if (job.status === "completed" && !job.review_submitted) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" /> Awaiting Review
        </Badge>
      );
    }
    switch (job.status?.toLowerCase()) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <Button onClick={() => navigate("/dashboard/post-job")}>
            <Plus className="h-4 w-4 mr-2" />
            Post a New Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <p>No active jobs found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-xl border shadow-sm p-6 space-y-4 ${
                job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {job.is_emergency && (
                    <Badge variant="destructive" className="text-xs">
                      Emergency
                    </Badge>
                  )}
                  {renderStatusLabel(job)}
                </div>
              </div>

              {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {job.image_urls.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Job image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border hover:opacity-90 transition"
                      />
                    </a>
                  ))}
                </div>
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

              {job.assigned_tradie && (
                <div className="flex items-center pt-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Assigned Tradie: {job.assigned_tradie}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => updateStatus(job.id, "completed")}
                >
                  Mark as Completed
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to cancel this job?")) {
                      updateStatus(job.id, "cancelled");
                    }
                  }}
                >
                  Cancel Job
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
