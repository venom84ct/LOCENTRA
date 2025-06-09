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
  Search,
  User,
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
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

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

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      setJobs(data || []);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    const matchesEmergency = showEmergencyOnly ? job.is_emergency === true : true;

    const isAssignedToAnother =
      job.assigned_tradie && job.assigned_tradie !== userId;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesEmergency &&
      (!isAssignedToAnother || job.assigned_tradie === userId)
    );
  });

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  const handlePurchaseLead = async (job: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tradieId = user.id;

    const { data: tradieProfile, error: tradieError } = await supabase
      .from("profile_centra_tradie")
      .select("first_name, abn, license, rating_avg")
      .eq("id", tradieId)
      .single();

    if (tradieError || !tradieProfile) {
      console.error("Failed to fetch tradie profile", tradieError);
      return;
    }

    const { data: leadData, error: leadError } = await supabase
      .from("job_leads")
      .insert([{ job_id: job.id, tradie_id: tradieId }]);

    if (leadError) {
      console.error("Failed to purchase lead", leadError.message);
      return;
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .insert({
        job_id: job.id,
        homeowner_id: job.homeowner_id,
        tradie_id: tradieId,
      })
      .select()
      .single();

    const autoMessage = `Hi! I'm interested in this job. Here's a bit about me:\n- ABN: ${tradieProfile.abn}\n- License: ${tradieProfile.license}\n- Rating: ${tradieProfile.rating_avg?.toFixed(1) || "N/A"}`;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: tradieId,
      message: autoMessage,
    });

    await fetchJobs();
    navigate(`/dashboard/tradie/messages?conversationId=${conversation.id}&jobId=${job.id}`);
  };

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
                  const profile = job.profile_centra_resident;

                  return (
                    <Card
                      key={job.id}
                      className={`bg-white p-4 border ${
                        job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {profile?.first_name || "Unknown"} {profile?.last_name || ""}
                        </span>
                        {profile?.avatar_url && (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full ml-auto"
                          />
                        )}
                      </div>

                      <h2 className="text-lg font-semibold">{job.title}</h2>
                      <p className="text-muted-foreground text-sm mb-2">{job.description}</p>

                      {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {job.image_urls.map((url: string, idx: number) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Job image ${idx + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-2 text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" /> {job.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.budget}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.timeline}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {isPurchased ? (
                          <>
                            <Badge className="bg-green-500 text-white">Purchased</Badge>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                navigate(
                                  `/dashboard/tradie/messages?jobId=${job.id}`
                                )
                              }
                            >
                              Message
                            </Button>
                          </>
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
