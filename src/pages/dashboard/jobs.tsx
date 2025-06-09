// src/pages/dashboard/jobs.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("jobs")
        .select("*, profile_centra_resident(first_name, avatar_url), job_leads(tradie_id, profile_centra_tradie(first_name, last_name))")
        .eq("homeowner_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setJobs(data || []);
      }
    };

    fetchJobs();
  }, []);

  const navigate = useNavigate();

  const handleCancelJob = async (jobId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ status: "cancelled" })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "cancelled" } : j
        )
      );
    }
  };

  const handleAssignTradie = async (jobId: string, tradieId: string) => {
    const { error } = await supabase
      .from("jobs")
      .update({ assigned_tradie: tradieId })
      .eq("id", jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, assigned_tradie: tradieId } : j
        )
      );
    }
  };

  return (
    <DashboardLayout userType="centra_resident">
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map((job) => {
            const isAssigned = !!job.assigned_tradie;
            const isCancelled = job.status === "cancelled";
            const isEmergency = job.is_emergency;

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
                      {isEmergency && <Badge variant="destructive">Emergency</Badge>}
                    </div>
                    {isAssigned ? (
                      <Badge variant="outline">In Progress</Badge>
                    ) : (
                      <Badge variant="secondary">Open for Quotes</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Budget: ${job.budget} | Location: {job.location} | Timeline: {job.timeline}
                  </div>
                  {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {job.image_urls.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank">
                          <img
                            src={url}
                            className="w-full h-24 object-cover rounded"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {!isAssigned && !isCancelled && job.job_leads?.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Assign Tradie:</label>
                      <select
                        onChange={(e) => handleAssignTradie(job.id, e.target.value)}
                        defaultValue=""
                        className="border px-3 py-2 rounded w-full"
                      >
                        <option value="" disabled>
                          Select a tradie
                        </option>
                        {job.job_leads.map((lead: any) => (
                          <option key={lead.tradie_id} value={lead.tradie_id}>
                            {lead.profile_centra_tradie.first_name} {lead.profile_centra_tradie.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isAssigned && (
                    <p className="text-sm text-green-600 font-medium">
                      Assigned to Tradie ID: {job.assigned_tradie}
                    </p>
                  )}

                  {!isAssigned && !isCancelled && (
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

                  {isCancelled && (
                    <p className="text-sm text-red-500 mt-2">This job was cancelled.</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobsPage;
