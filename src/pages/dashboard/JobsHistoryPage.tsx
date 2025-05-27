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

      const { data: profile, error: profileError } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
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
        setError("Failed to load jobs.");
        console.error(jobsError);
      } else {
        setJobs(jobsData || []);
      }
    };

    fetchUserAndJobs();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <p>{
