// src/pages/dashboard/JobsHistoryPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const JobsHistoryPage: React.FC = () => {
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
      <h1 className="text-2xl font-semibold mb-4">Completed Job History</h1>
      {jobs.length === 0 ? (
        <p>No completed jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow border">
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-400 mt-2">Completed on: {job.updated_at?.slice(0, 10)}</p>
              <button
                onClick={() => navigate(`/dashboard/edit-job/${job.id}`)}
                className="mt-3 text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsHistoryPage;
