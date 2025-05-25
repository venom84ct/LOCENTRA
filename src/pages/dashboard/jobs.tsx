import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

const JobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;
      setUser(user);

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setJobs(data || []);
    };

    fetchJobs();
  }, []);

  const renderStatus = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    }
  };

  return (
    <DashboardLayout userType="centraResident" user={{ email: user?.email }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <Button onClick={() => (window.location.href = "/post-job")}>Post New Job</Button>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.category}</CardDescription>
                    </div>
                    {renderStatus(job.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-gray-600">{job.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.budget}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    {job.status === "open" && (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateJobStatus(job.id, "cancelled")}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateJobStatus(job.id, "completed")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </Button>
                      </>
                    )}
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

export default JobsPage;

