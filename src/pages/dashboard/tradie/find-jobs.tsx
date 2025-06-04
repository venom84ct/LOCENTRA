// Updated FindJobsPage
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, Filter, Search, User } from "lucide-react";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [purchasedJobs, setPurchasedJobs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchPurchasedJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, profile_centra_resident(id, first_name, last_name, avatar_url)")
      .or("status.eq.open,status.eq.available")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching jobs:", error.message);
    else setJobs(data);
  };

  const fetchPurchasedJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("job_leads")
      .select("job_id")
      .eq("tradie_id", user.id);

    if (!error && data) {
      setPurchasedJobs(data.map((d) => d.job_id));
    }
  };

  const handlePurchaseLead = async (job: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;

    // Check if lead already purchased
    const { data: existing, error: leadError } = await supabase
      .from("job_leads")
      .select("*")
      .eq("job_id", job.id)
      .eq("tradie_id", user.id)
      .maybeSingle();

    if (!existing) {
      // Insert into job_leads
      await supabase.from("job_leads").insert({
        job_id: job.id,
        tradie_id: user.id,
      });

      // Fetch tradie info
      const { data: tradieProfile } = await supabase
        .from("profile_centra_tradie")
        .select("first_name, abn, license, rating, portfolio")
        .eq("id", user.id)
        .single();

      // Create conversation
      const { data: convo } = await supabase
        .from("conversations")
        .insert({
          homeowner_id: job.homeowner_id,
          tradie_id: user.id,
          job_id: job.id,
        })
        .select()
        .single();

      // Send first message
      if (convo?.id) {
        const thumbnails = (tradieProfile?.portfolio || []).slice(0, 3);
        const messageBody = `
Hi! I'm interested in this job. Here’s my info:

- Name: ${tradieProfile?.first_name || "Tradie"}
- ABN: ${tradieProfile?.abn}
- License: ${tradieProfile?.license}
- Rating: ${tradieProfile?.rating ?? "N/A"}

Portfolio:
${thumbnails.map((url) => `🖼️ ${url}`).join("\n")}
        `.trim();

        await supabase.from("messages").insert({
          conversation_id: convo.id,
          sender_id: user.id,
          message: messageBody,
        });

        setPurchasedJobs((prev) => [...prev, job.id]);
        navigate(`/dashboard/tradie/messages?conversationId=${convo.id}`);
      }
    }
  };

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

  const mockUser = {
    name: "Mike Johnson",
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
            {/* Sidebar filters */}
            <div className="md:col-span-1">
              <Card className="bg-white sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" /> Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label htmlFor="search">Search</label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search jobs..."
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedCategory === null ? "default" : "outline"}
                        onClick={() => setSelectedCategory(null)}
                        className="cursor-pointer"
                      >
                        All
                      </Badge>
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          onClick={() => setSelectedCategory(category)}
                          className="cursor-pointer"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showEmergencyOnly}
                      onChange={() => setShowEmergencyOnly(!showEmergencyOnly)}
                      className="h-4 w-4"
                    />
                    <label>Emergency only</label>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                      setShowEmergencyOnly(false);
                    }}
                  >
                    Reset
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Job cards */}
            <div className="md:col-span-3 grid gap-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`p-4 shadow-sm space-y-4 border ${
                      job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="text-muted-foreground" />
                        <span>
                          {job.profile_centra_resident?.first_name || "Unknown"}{" "}
                          {job.profile_centra_resident?.last_name || ""}
                        </span>
                      </div>
                      {job.profile_centra_resident?.avatar_url && (
                        <img
                          src={job.profile_centra_resident.avatar_url}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">{job.title}</h2>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      <div className="text-sm mt-2">
                        <p>📍 {job.location}</p>
                        <p>💰 ${job.budget}</p>
                        <p>🕒 {job.timeline}</p>
                        <p>🏷️ {job.category}</p>
                      </div>
                      {job.image_urls?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {job.image_urls.slice(0, 3).map((url: string, index: number) => (
                            <img
                              key={index}
                              src={url}
                              alt="Job"
                              className="h-16 w-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {purchasedJobs.includes(job.id) ? (
                      <div className="flex justify-between items-center">
                        <Badge className="bg-green-600 text-white">Purchased</Badge>
                        <Button
                          variant="secondary"
                          onClick={async () => {
                            const { data } = await supabase
                              .from("conversations")
                              .select("id")
                              .eq("job_id", job.id)
                              .eq("tradie_id", (await supabase.auth.getUser()).data.user?.id)
                              .maybeSingle();

                            if (data?.id) {
                              navigate(`/dashboard/tradie/messages?conversationId=${data.id}`);
                            }
                          }}
                        >
                          Message
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => handlePurchaseLead(job)}>Purchase Lead</Button>
                    )}
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No jobs found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters.
                    </p>
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
