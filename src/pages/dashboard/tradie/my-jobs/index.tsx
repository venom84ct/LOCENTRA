// src/pages/dashboard/tradie/my-jobs.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("job_leads")
        .select("job_id, jobs(*, profile_centra_resident(first_name, last_name, avatar_url))")
        .eq("tradie_id", user.id);

      if (!error) {
        const jobData = data.map((lead) => lead.jobs).filter(Boolean);
        setJobs(jobData);
      }
    };

    fetchJobs();
  }, []);

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
        <div className="space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const profile = job.profile_centra_resident;
              const isAssignedToMe = job.assigned_tradie === userId;

              return (
                <Card
                  key={job.id}
                  className={`p-4 ${job.is_emergency ? "border-red-500 border-2" : "border"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{job.title}</h2>
                      <p className="text-sm text-muted-foreground">{job.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback>{profile?.first_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{profile?.first_name || "Homeowner"}</span>
                      </div>
                    </div>
                    {job.is_emergency && <Badge variant="destructive">Emergency</Badge>}
                  </div>

                  <p className="mt-2 text-sm">{job.description}</p>

                  {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {job.image_urls.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} className="w-full h-24 object-cover rounded" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />{" "}
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> {job.budget}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> {job.timeline}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    {isAssignedToMe || !job.assigned_tradie ? (
                      <Button onClick={() => navigate(`/dashboard/tradie/messages?jobId=${job.id}`)}>
                        <MessageSquare className="h-4 w-4 mr-1" /> Message
                      </Button>
                    ) : (
                      <Badge variant="outline">Assigned to another tradie</Badge>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No job leads found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You haven’t purchased any leads yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyJobsPage;
