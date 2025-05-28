// src/pages/dashboard/tradie/find-jobs.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  ShoppingCart,
} from "lucide-react";

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

      const { data: allJobs, error } = await supabase
        .from("jobs")
        .select("*")
        .not("status", "in", "('completed','cancelled')")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading jobs:", error.message);
        return;
      }

      const availableJobs = allJobs.filter((job) => job.tradie_id == null);
      setJobs(availableJobs);
    };

    fetchJobs();
  }, []);

  const handlePurchase = async (jobId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !profile?.id) return;

    const { error } = await supabase
      .from("jobs")
      .update({ tradie_id: profile.id })
      .eq("id", jobId);

    if (error) {
      console.error("Error purchasing lead:", error.message);
    } else {
      navigate("/dashboard/tradie/messages");
    }
  };

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="px-4 py-6 max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">Available Job Leads</h1>
        {jobs.length === 0 ? (
          <p>No job leads available at the moment.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-xl border shadow-sm p-6 space-y-4 ${
                job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {job.is_emergency && (
                    <Badge variant="destructive" className="text-xs">Emergency</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {job.is_emergency ? "10 credits" : "5 credits"}
                  </Badge>
                </div>
              </div>

              <p className="text-sm">{job.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
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

              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handlePurchase(job.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Purchase Lead ({job.is_emergency ? "10" : "5"} credits)
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
