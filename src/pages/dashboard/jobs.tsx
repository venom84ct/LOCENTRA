import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Clock } from "lucide-react";

const DashboardJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setError("Not logged in.");

      const { data: profileData } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData) return setError("Unable to load profile.");

      setProfile(profileData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", profileData.id)
        .not("status", "in", "('completed','cancelled')")
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
    };

    fetchJobs();
  }, []);

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status })
      .eq("id", jobId);

    if (error) {
      alert("Failed to update job status.");
    } else {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Active Jobs</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {jobs.length === 0 ? (
          <p>No active jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`rounded-2xl shadow-md bg-white border ${
                  job.is_emergency ? "border-red-600 border-4" : "border-gray-200"
                } p-6`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        {job.is_emergency && (
                          <Badge variant="destructive">Emergency</Badge>
                        )}
                      </div>
                      <CardDescription>{job.category}</CardDescription>
                    </div>
                    {renderStatusBadge(job.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Show job image if available */}
                  {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                    <img
                      src={job.image_urls[0]}
                      alt="Job"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  )}

                  <p className="text-sm">{job.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
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

                  <div className="flex gap-2 mt-4">
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
                      onClick={() => updateJobStatus(job.id, "completed")}
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateJobStatus(job.id, "cancelled")}
                    >
                      Cancel Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobs;
