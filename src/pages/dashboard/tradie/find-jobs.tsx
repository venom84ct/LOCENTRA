
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

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

      // ✅ Get tradie profile
      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // ✅ Fetch available jobs
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .is("tradie_id", null)
        .in("status", ["pending", "in_progress"]) // Adjust as needed
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
    };

    fetchJobs();
  }, []);

  const getCreditCost = (job: any) => (job.is_emergency ? 10 : 5);

  const handlePurchase = async (jobId: string, cost: number) => {
    if (!profile || profile.credits < cost) {
      alert("Not enough credits");
      return;
    }

    // ✅ Assign tradie to job
    const { error: updateJobError } = await supabase
      .from("jobs")
      .update({ tradie_id: profile.id })
      .eq("id", jobId);

    if (updateJobError) {
      console.error(updateJobError.message);
      return;
    }

    // ✅ Deduct credits
    await supabase
      .from("profile_centra_tradie")
      .update({ credits: profile.credits - cost })
      .eq("id", profile.id);

    // ✅ Refresh jobs list
    const { data: updatedJobs } = await supabase
      .from("jobs")
      .select("*")
      .is("tradie_id", null)
      .in("status", ["pending", "in_progress"])
      .order("created_at", { ascending: false });

    setJobs(updatedJobs || []);
    alert("Lead purchased. You can now message the homeowner.");
  };

  return (
    <DashboardLayout user={profile} userType="tradie">
      <div className="px-4 py-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Job Leads</h1>
        <div className="space-y-6">
          {jobs.length === 0 && (
            <p className="text-center text-gray-500">No available jobs right now.</p>
          )}

          {jobs.map((job) => {
            const cost = getCreditCost(job);
            return (
              <div
                key={job.id}
                className={`bg-white p-6 rounded-xl shadow border ${
                  job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {job.is_emergency && (
                      <Badge variant="destructive">Emergency</Badge>
                    )}
                    <Badge variant="secondary">{cost} credits</Badge>
                  </div>
                </div>

                <p className="text-sm mt-2 mb-4">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
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

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/tradie/preview-job/${job.id}`)}
                  >
                    Preview
                  </Button>
                  <Button onClick={() => handlePurchase(job.id, cost)}>
                    Purchase Lead ({cost} credits)
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
