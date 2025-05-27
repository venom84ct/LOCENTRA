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

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!profileData) return;

      setProfile(profileData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", profileData.id)
        .not("status", "in", "('completed','cancelled')")
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
    };

    fetchData();
  }, []);

  const updateStatus = async (jobId: string, newStatus: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (!error) {
      // remove job from list immediately
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } else {
      console.error("Failed to update status:", error);
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
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {job.category}
                  </p>
                </div>
                <div>{renderStatusLabel(job.status)}</div>
              </div>

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
