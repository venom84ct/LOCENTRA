// src/pages/dashboard/find-jobs.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, Filter, Search, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      .select("*, profile_centra_resident(first_name, last_name, avatar_url)")
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

    // Insert into job_leads if not already purchased
    const { data: existingLead } = await supabase
      .from("job_leads")
      .select("*")
      .eq("job_id", job.id)
      .eq("tradie_id", user.id)
      .maybeSingle();

    if (!existingLead) {
      await supabase.from("job_leads").insert({ job_id: job.id, tradie_id: user.id });
    }

    // Create or find existing conversation
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
    }

    // Fetch tradie profile for auto message
    const { data: tradieProfile, error: tradieError } = await supabase
      .from("profile_centra_tradie")
      .select("first_name, abn, license, rating, portfolio")
      .eq("id", user.id)
      .single();

    if (tradieError || !tradieProfile) {
      console.error("Failed to fetch tradie profile", tradieError);
      return;
    }

    const thumbnails = Array.isArray(tradieProfile.portfolio)
      ? tradieProfile.portfolio.slice(0, 3).join(", ")
      : "";

    const autoMessage = `Hi, I'm ${tradieProfile.first_name}.\nABN: ${tradieProfile.abn}\nLicense: ${tradieProfile.license}\nRating: ${tradieProfile.rating}\nRecent Work: ${thumbnails}`;

    // Insert auto message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: autoMessage,
    });

    navigate(`/dashboard/tradie/messages?conversationId=${conversationId}`);
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
                  <div className="space-y-2">
                    <label htmlFor="search" className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search jobs..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={selectedCategory === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(null)}>
                        All
                      </Badge>
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emergency-only"
                      checked={showEmergencyOnly}
                      onChange={() => setShowEmergencyOnly(!showEmergencyOnly)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="emergency-only" className="text-sm font-medium">
                      Emergency jobs only
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                      setShowEmergencyOnly(false);
                    }}>
                      Reset Filters
                    </Button>
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
                      className={`bg-white border rounded-lg shadow-sm p-4 space-y-4 ${job.is_emergency ? "border-red-600 border-2" : "border-gray-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">
                          {job.profile_centra_resident?.first_name || "Unknown"} {job.profile_centra_resident?.last_name || ""}
                        </span>
                        {job.profile_centra_resident?.avatar_url && (
                          <img
                            src={job.profile_centra_resident.avatar_url}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full ml-auto"
                          />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{job.title}</h2>
                        <p className="text-muted-foreground text-sm">{job.description}</p>
                        <p className="text-sm">Category: {job.category}</p>
                        <p className="text-sm">Location: {job.location}</p>
                        <p className="text-sm">Budget: {job.budget}</p>
                        <p className="text-sm">Timeline: {job.timeline}</p>
                        {job.image_urls && Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {job.image_urls.map((url: string) => (
                              <img key={url} src={url} alt="Job" className="h-16 w-16 rounded border object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                      <Button onClick={() => handlePurchaseLead(job)}>
                        Purchase Lead
                      </Button>
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
                      <Button onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory(null);
                        setShowEmergencyOnly(false);
                      }}>
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
