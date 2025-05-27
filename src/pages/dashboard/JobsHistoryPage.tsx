// src/pages/dashboard/JobsHistoryPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const JobsHistoryPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "completed");

      if (error) {
        console.error("Error fetching completed jobs:", error);
      } else {
        setJobs(data || []);
      }
    };

    fetchCompletedJobs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Completed Jobs</h1>
      {jobs.length === 0 ? (
        <p>No completed jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
            >
              <h2 className="text-lg font-bold mb-1">{job.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {job.description?.slice(0, 100)}...
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Completed on: {job.updated_at?.slice(0, 10)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsHistoryPage;
