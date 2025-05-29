// src/pages/dashboard/tradie/find-jobs.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  created_at: string;
  is_emergency: boolean;
  status: string;
}

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tradieProfile } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(tradieProfile);

      const { data: availableJobs, error } = await supabase
        .from("jobs")
        .select("*")
        .is("assigned_tradie", null)
        .in("status", ["open", "in_progress"]);

      if (availableJobs) {
        setJobs(availableJobs);
      }

      setLoading(false);
    };

    fetchJobsAndProfile();
  }, []);

  const handleViewJob = (jobId: string) => {
    navigate(`/dashboard/tradie/job-preview/${jobId}`);
  };

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No available jobs at the moment.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`${
                  job.is_emergency ? "border-red-600 border-2" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {job.category} – {job.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {job.is_emergency && (
                        <Badge variant="destructive">Emergency</Badge>
                      )}
                      <Badge>{job.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm">{job.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Budget: {job.budget} • Timeline: {job.timeline}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => handleViewJob(job.id)}
                  >
                    View & Purchase
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

export default FindJobsPage;
