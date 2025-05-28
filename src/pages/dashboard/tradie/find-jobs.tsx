import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Clock } from "lucide-react";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData) return;

      setProfile(profileData);

      const { data: jobList } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .is("tradie_id", null)
        .order("created_at", { ascending: false });

      setJobs(jobList || []);
    };

    fetchJobs();
  }, []);

  const handleUnlockJob = async (job: any) => {
    if (!profile || profile.credits < 5) {
      alert("You need at least 5 credits to unlock this job.");
      return;
    }

    const { error: convoError } = await supabase.from("conversations").insert({
      job_id: job.id,
      homeowner_id: job.homeowner_id,
      tradie_id: profile.id,
    });

    if (convoError) {
      alert("Failed to create conversation.");
      return;
    }

    await supabase
      .from("jobs")
      .update({ tradie_id: profile.id })
      .eq("id", job.id);

    await supabase
      .from("profile_centra_resident")
      .update({ credits: profile.credits - 5 })
      .eq("id", profile.id);

    alert("Job unlocked. You can now message the homeowner.");
    navigate("/dashboard/tradie/messages");
  };

  return (
    <DashboardLayout user={profile} userType="tradie">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
        {jobs.length === 0 ? (
          <p>No available jobs at the moment.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                </div>
                {job.is_emergency && (
                  <Badge variant="destructive">Emergency</Badge>
                )}
              </div>

              <p className="text-sm">{job.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
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
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {job.timeline}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="success"
                  onClick={() => handleUnlockJob(job)}
                >
                  Unlock Job (5 Credits)
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
