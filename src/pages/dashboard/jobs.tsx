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
} from "lucide-react";

const DashboardJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Reusable job fetcher (used on page load & after update)
  const refetchJobs = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profile_centra_resident")
      .select("*")
      .eq("id", userId)
      .single();

    if (!profileData) return;

    setProfile(profileData);

    const { data: jobsData, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("homeowner_id", profileData.id)
      .not("status", "in", "('completed','cancelled')")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Failed to fetch jobs:", error.message);
    }

    setJobs(jobsData || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await refetchJobs(user.id);
    };

    fetchData();
  }, []);

  const updateStatus = async (jobId: string, newStatus: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const lowercaseStatus = newStatus.toLowerCase(); // 🔒 for consistency

    const { error } = await supabase
      .from("jobs")
      .update({ status: lowercaseStatus, homeowner_id: user.id }) // ✅ enforce lowercase and RLS pass
      .eq("id", jobId)
      .eq("homeowner_id", user.id);

    if (error) {
      console.error("❌ Failed to update job:", error.message);
    } else {
      console.log("✅ Job status updated to:", lowercaseStatus);
      await refetchJobs(user.id); // ✅ force refresh
    }
  };

  const renderStatusLabel = (status: string) => {
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
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
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
                    <Badge variant="destructive" className="text-xs">Emergency</Badge>
                  )}
                  {renderStatusLabel(job.status)}
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
                    alt="Job image"
                    className="w-full h-40 object-cover rounded-md border hover:opacity-90 transition"
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
                  variant="success"
                  onClick={() => updateStatus(job.id, "completed")}
                >
                  Mark as Completed
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(job.id, "cancelled")}
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
