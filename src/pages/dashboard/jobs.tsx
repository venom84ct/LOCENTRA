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
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      setLoading(false);
    };

    fetchJobs();

    const channel = supabase
      .channel("realtime-jobs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        (payload) => {
          if (payload.new?.homeowner_id === user?.id) {
            setJobs((prevJobs) => {
              const index = prevJobs.findIndex((j) => j.id === payload.new.id);
              if (index !== -1) {
                const updated = [...prevJobs];
                updated[index] = payload.new;
                return updated;
              }
              return [payload.new, ...prevJobs];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.filter((job) =>
          newStatus === "cancelled" ? job.id !== jobId : true
        )
      );
    }
  };

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

  return (
    <DashboardLayout userType="centraResident" user={{ email: user?.email }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <Button onClick={() => navigate("/post-job")}>Post New Job</Button>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className={`border ${job.is_emergency ? "border-red-500" : "border-gray-200"}`}>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
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
                  </div>

                  {job.image_urls?.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {job.image_urls.map((url: string, i: number) => (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={i}
                        >
                          <img
                            src={url}
                            alt={`Job Image ${i + 1}`}
                            className="rounded object-cover h-32 w-full hover:opacity-90 transition"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {job.status === "open" && (
                    <div className="mt-4 flex gap-2 justify-end">
                      <Button
                        variant="destructive"
                        onClick={() => updateJobStatus(job.id, "cancelled")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel Job
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateJobStatus(job.id, "completed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Complete
                      </Button>
                    </div>
                  )}
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
