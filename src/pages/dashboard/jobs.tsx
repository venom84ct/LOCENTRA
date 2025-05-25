import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  created_at: string;
  budget: string;
  image_urls?: string[];
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load jobs:", error.message);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="p-4">Loading jobs...</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{job.description}</p>
              <p className="text-sm text-muted-foreground">
                Budget: {job.budget}
              </p>
              <p className="text-sm text-muted-foreground">
                Posted: {new Date(job.created_at).toLocaleDateString()}
              </p>
              <Badge variant="outline" className="capitalize">
                {job.status}
              </Badge>
              {job.image_urls?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {job.image_urls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Job image ${i + 1}`}
                      className="w-full h-auto rounded"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default JobsPage;
