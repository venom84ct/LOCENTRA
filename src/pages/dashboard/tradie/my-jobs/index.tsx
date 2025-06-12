import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, MapPin, Calendar, DollarSign, Trash2, CheckCircle } from "lucide-react";

const MyJobsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data, error } = await supabase
        .from("job_leads")
        .select("*, jobs(*, profile_centra_resident(first_name, last_name, avatar_url))")
        .eq("tradie_id", user.id);

      if (error) console.error(error);
      else setLeads(data);
    };
    fetchData();
  }, []);

  const handleDeleteLead = async (jobId: string) => {
    if (!user) return;
    await supabase.from("job_leads").delete().match({ job_id: jobId, tradie_id: user.id });
    setLeads((prev) => prev.filter((l) => l.job_id !== jobId));
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Jobs</h1>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <p>No job leads found.</p>
          ) : (
            leads.map((lead) => {
              const job = lead.jobs;
              const profile = job.profile_centra_resident;
              const isAssigned = job.assigned_tradie === user.id;
              const isCompleted = job.status === "completed";
              const isUnassigned = !job.assigned_tradie;

              return (
                <Card
                  key={lead.id}
                  className={`border ${
                    isAssigned ? "bg-[#CAEEC2] border-green-600" : "border-gray-200"
                  } ${job.is_emergency ? "border-red-600 border-2" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{job.title}</span>
                      <div className="flex gap-2">
                        {isCompleted && (
                          <Badge className="bg-green-700 text-white">Completed</Badge>
                        )}
                        {isAssigned && !isCompleted && (
                          <Badge variant="outline">Assigned to you</Badge>
                        )}
                        {isUnassigned && <Badge variant="secondary">Open</Badge>}
                        {job.is_emergency && <Badge variant="destructive">Emergency</Badge>}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-muted-foreground text-sm">{job.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3 text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" /> {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" /> {job.budget}
                      </div>
                    </div>

                    {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                        {job.image_urls.map((url: string, idx: number) => (
                          <a href={url} target="_blank" rel="noopener noreferrer" key={idx}>
                            <img
                              src={url}
                              alt={`Job image ${idx + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {profile && (
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback>{profile.first_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <span>
                            {profile.first_name} {profile.last_name}
                          </span>
                        </div>
                      )}
                      <Button
                        onClick={() =>
                          (window.location.href = `/dashboard/tradie/messages?jobId=${job.id}`)
                        }
                        className="ml-auto"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" /> Message
                      </Button>

                      {/* Allow delete after completion */}
                      {isAssigned && isCompleted && (
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteLead(job.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete Job
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyJobsPage;
