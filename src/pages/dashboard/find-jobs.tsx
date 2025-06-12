// src/pages/dashboard/tradie/find-jobs.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [purchasedLeads, setPurchasedLeads] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    loadUserId();
  }, []);

  const fetchJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: leadsData } = await supabase
      .from("job_leads")
      .select("job_id")
      .eq("tradie_id", user.id);

    setPurchasedLeads(leadsData?.map((l) => l.job_id) || []);

    const { data, error } = await supabase
      .from("jobs")
      .select("*, profile_centra_resident(id, first_name, last_name, avatar_url)")
      .or("status.eq.open,status.eq.available")
      .order("created_at", { ascending: false });

    if (!error) setJobs(data || []);
    else console.error("Error fetching jobs:", error.message);
  };

  useEffect(() => {
    if (userId) fetchJobs();
  }, [userId]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    const matchesEmergency = showEmergencyOnly ? job.is_emergency === true : true;

    return matchesSearch && matchesCategory && matchesEmergency;
  });

  const handlePurchaseLead = async (job: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tradieId = user.id;

    const { data: tradieProfile } = await supabase
      .from("profile_centra_tradie")
      .select("first_name, abn, license, rating_avg")
      .eq("id", tradieId)
      .single();

    const { data: conversation } = await supabase
      .from("conversations")
      .insert({
        job_id: job.id,
        homeowner_id: job.homeowner_id,
        tradie_id: tradieId,
      })
      .select()
      .single();

    await supabase.from("job_leads").insert([{ job_id: job.id, tradie_id: tradieId }]);

    const autoMessage = `Hi! I'm interested in this job. Here's a bit about me:\n- ABN: ${tradieProfile.abn}\n- License: ${tradieProfile.license}\n- Rating: ${tradieProfile.rating_avg?.toFixed(1) || "N/A"}`;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: tradieId,
      message: autoMessage,
      tradie_id: tradieId,
      homeowner_id: job.homeowner_id,
      is_read: false,
    });

    await fetchJobs();
    navigate(`/dashboard/tradie/messages?conversationId=${conversation.id}&jobId=${job.id}`);
  };

  const handleDeleteLead = async (jobId: string) => {
    await supabase
      .from("job_leads")
      .delete()
      .eq("job_id", jobId)
      .eq("tradie_id", userId);

    fetchJobs();
  };

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  const mockUser = {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    trade: "Plumber",
    credits: 45,
  };

  return (
    <DashboardLayout userType="tradie" user={mockUser}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Find Jobs</h1>
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">{mockUser.credits} credits available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card className="bg-white sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" /> Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedCategory === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(null)}
                    >
                      All
                    </Badge>
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emergency-only"
                      checked={showEmergencyOnly}
                      onChange={() => setShowEmergencyOnly(!showEmergencyOnly)}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <label htmlFor="emergency-only" className="text-sm">
                      Emergency jobs only
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const isPurchased = purchasedLeads.includes(job.id);
                  const isAssignedToAnother = job.assigned_tradie && job.assigned_tradie !== userId;

                  return (
                    <Card
                      key={job.id}
                      className={`p-4 shadow-sm rounded-xl border bg-white space-y-3 ${
                        job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold mb-1">{job.title}</h2>
                          <p className="text-muted-foreground text-sm">{job.category}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <img
                              src={job.profile_centra_resident?.avatar_url || "https://via.placeholder.com/40"}
                              alt="Homeowner Avatar"
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">
                              {job.profile_centra_resident?.first_name || "Unknown"}
                            </span>
                          </div>
                        </div>
                        {job.is_emergency && (
                          <Badge variant="destructive" className="text-xs">
                            Emergency
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm">{job.description}</p>

                      {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {job.image_urls.map((url: string, idx: number) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt="Job image"
                                className="w-full h-24 object-cover rounded border"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 text-sm gap-2 text-muted-foreground">
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
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" /> {job.timeline}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        {isPurchased && isAssignedToAnother ? (
                          <>
                            <Badge variant="outline" className="text-red-600 border-red-400">
                              Assigned to another tradie
                            </Badge>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteLead(job.id)}
                            >
                              Delete Lead
                            </Button>
                          </>
                        ) : isPurchased ? (
                          <Button
                            variant="destructive"
                            onClick={() =>
                              navigate(`/dashboard/tradie/messages?jobId=${job.id}`)
                            }
                          >
                            Message
                          </Button>
                        ) : (
                          <Button onClick={() => handlePurchaseLead(job)}>
                            Purchase Lead
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      We couldn’t find any jobs matching your filters.
                    </p>
                    <Button onClick={() => fetchJobs()}>Reload Jobs</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
