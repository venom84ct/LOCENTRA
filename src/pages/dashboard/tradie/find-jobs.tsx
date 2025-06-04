// src/pages/dashboard/find-jobs.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, Filter, Search, MapPin, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, profile_centra_resident(id, first_name, last_name, avatar_url)")
      .or("status.eq.open,status.eq.available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error.message);
    } else {
      setJobs(data);
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

    return matchesSearch && matchesCategory && matchesEmergency;
  });

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  const handlePurchaseLead = async (job: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) return;

    const { data: tradieProfile, error: tradieError } = await supabase
      .from("profile_centra_tradie")
      .select("first_name, abn, license, rating, portfolio")
      .eq("id", user.id)
      .single();

    if (tradieError || !tradieProfile) {
      console.error("Failed to fetch tradie profile", tradieError);
      return;
    }

    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("*")
      .eq("homeowner_id", job.homeowner_id)
      .eq("tradie_id", user.id)
      .maybeSingle();

    let conversationId = existingConvo?.id;

    if (!conversationId) {
      const { data: newConvo } = await supabase
        .from("conversations")
        .insert({ homeowner_id: job.homeowner_id, tradie_id: user.id })
        .select()
        .single();

      conversationId = newConvo?.id;

      const introMessage = `Hi, I'm ${tradieProfile.first_name}. Here's my info:\n\n- ABN: ${tradieProfile.abn}\n- License: ${tradieProfile.license}\n- Rating: ${tradieProfile.rating}\n- Portfolio: ${tradieProfile.portfolio?.slice(0, 3).join(", ")}`;

      if (conversationId) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: introMessage,
        });
      }
    }

    if (conversationId) {
      navigate(`/dashboard/tradie/messages?conversationId=${conversationId}`);
    }
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
                    />
                    <label htmlFor="emergency-only">Emergency jobs only</label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className={`bg-white border rounded-lg shadow p-4 space-y-3 ${
                        job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {job.profile_centra_resident?.avatar_url ? (
                            <img
                              src={job.profile_centra_resident.avatar_url}
                              alt="Avatar"
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300" />
                          )}
                          <span className="font-medium">
                            {job.profile_centra_resident?.first_name || "Unknown"} {job.profile_centra_resident?.last_name || ""}
                          </span>
                        </div>
                        {job.is_emergency && (
                          <Badge variant="destructive" className="text-xs">Emergency</Badge>
                        )}
                      </div>
                      <h2 className="text-lg font-bold">{job.title}</h2>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      <p className="text-xs text-muted-foreground italic">Category: {job.category}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" /> {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" /> ${job.budget}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> {job.timeline}
                        </div>
                      </div>

                      {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {job.image_urls.map((url: string, i: number) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Job img ${i + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      <Button onClick={() => handlePurchaseLead(job)}>Purchase Lead</Button>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        We couldn't find any jobs matching your search criteria.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory(null);
                          setShowEmergencyOnly(false);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
