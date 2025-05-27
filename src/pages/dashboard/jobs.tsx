import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
      if (!user) {
        setError("Not logged in.");
        return;
      }

      // Get profile from profile_centra_resident
      const { data: profileData, error: profileError } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        setError("Unable to fetch user profile.");
        return;
      }

      setProfile(profileData);

      // Fetch only active jobs (not completed or cancelled)
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", profileData.id)
        .not("status", "in", "('completed','cancelled')")
        .order("created_at", { ascending: false });

      if (jobsError) {
        console.error(jobsError);
        setError("Failed to load jobs.");
      } else {
        setJobs(jobsData || []);
      }
    };

    fetchJobs();
  }, []);

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

  if (!profile) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Active Jobs</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {jobs.length === 0 ? (
          <p>No active jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`bg-white ${job.is_emergency ? "border-4 border-red-600" : ""}`}
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
                <CardContent>
                  <p className="text-sm mb-4">{job.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.budget}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.timeline}
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
                  >
                    Edit Job
                  </Button>
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
