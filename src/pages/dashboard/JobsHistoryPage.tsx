import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  User,
  Trash2,
} from "lucide-react";

const JobsHistoryPage = () => {
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

      if (!profileData) return;

      setProfile(profileData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`
          *,
          profile_centra_tradie!assigned_tradie(first_name, last_name)
        `)
        .eq("homeowner_id", profileData.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
    };

    fetchData();
  }, []);

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (!error) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  const renderStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <DashboardLayout user={profile} userType="centraResident">
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">Completed Jobs</h1>
        {jobs.length === 0 ? (
          <p>No completed jobs found.</p>
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
                  {renderStatusLabel(job.status)}
                </div>
              </div>

              {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                <a
                  href={job.image_urls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={job.image_urls[0]}
                    alt="Job"
                    className="w-full h-40 object-cover rounded-md border hover:opacity-90 transition"
                  />
                </a>
              )}

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

              {job.profile_centra_tradie && (
                <div className="flex items-center pt-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Assigned Tradie: {job.profile_centra_tradie.first_name} {job.profile_centra_tradie.last_name}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteJob(job.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobsHistoryPage;
