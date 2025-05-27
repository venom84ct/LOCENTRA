// src/pages/dashboard/JobsHistoryPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

const JobsHistoryPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setUser(profile);

      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "completed")
        .eq("homeowner_id", profile.id);

      if (error) console.error("Error fetching jobs:", error);
      else setJobs(jobsData || []);
    };

    fetchUserAndJobs();
  }, []);

  if (!user) return <div className="p-8">Loading...</div>;

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
                  {job.description?.slice(0, 100)
