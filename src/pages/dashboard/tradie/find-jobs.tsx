import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .in("status", ["open", "in_progress"])
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
    };

    fetchData();
  }, []);

  const purchaseLead = async (jobId: string) => {
    alert(`Pretend to deduct credits and unlock job ${jobId}`);
    // Future: implement credit deduction + unlock logic here
  };

  return (
    <DashboardLayout user={profile} userType="centraTradie">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Available Job Leads</h1>
        <div className="space-y-6">
          {jobs.map((job) => {
            const creditCost = job.is_emergency ? 10 : 5;
            return (
              <div
                key={job.id}
                className={`bg-white p-6 rounded-lg border ${
                  job.is_emergency ? "border-red-600 border-2" : "shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">{job.title}</h2>
                    <p className="text-sm text-gray-600">
                      {job.category}
                    </p>
                  </div>
                  <div className="text-sm text-right text-muted-foreground">
                    <Badge variant="outline">{creditCost} credits</Badge>
                  </div>
                </div>

                {job.is_emergency && (
                  <Badge variant="destructive" className="mt-2">
                    Emergency
                  </Badge>
                )}

                <p className="mt-3 text-sm">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-sm text-gray-600">
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

                <div className="flex justify-end mt-4 space-x-3">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => purchaseLead(job.id)}>
                    Purchase Lead ({creditCost} credits)
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
