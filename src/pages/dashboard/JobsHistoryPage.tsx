import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

const JobsHistoryPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("User not authenticated.");
        return;
      }

      console.log("User ID:", user.id); // Debugging

      const { data: profile, error: profileError } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id) // ✅ This is the correct query now
        .single();

      if (profileError || !profile) {
        console.error("Profile error:", profileError);
        setError("Unable to fetch user profile.");
        return;
      }

      setUser(profile);

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "completed")
        .eq("homeowner_id", profile.id);

      if (jobsError) {
        console.error("Jobs fetch error:", jobsError);
        setError("Failed to load jobs.");
      } else {
        setJobs(jobsData || []);
      }
    };

    fetchUserAndJobs();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout user={user} userType="centraResident">
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
    </DashboardLayout>
  );
};

export default JobsHistoryPage;
