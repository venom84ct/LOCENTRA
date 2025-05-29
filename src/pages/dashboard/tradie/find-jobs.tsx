import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  timeline: string;
  created_at: string;
  status: string;
  is_emergency?: boolean;
  image_urls?: string[];
}

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .is("assigned_tradie", null)
        .not("status", "in", ["completed", "cancelled"])
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching jobs:", error);
      else setJobs(data || []);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Find Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className={`bg-white ${job.is_emergency ? "border-4 border-red-600" : ""}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <p className="text-sm text-gray-500">{job.category}</p>
                  </div>
                  <div className="space-x-2">
                    {job.is_emergency && (
                      <Badge variant="destructive">Emergency</Badge>
                    )}
                    <Badge>{job.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindJobsPage;
