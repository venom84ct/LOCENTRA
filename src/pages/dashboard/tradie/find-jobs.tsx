// src/pages/dashboard/find-jobs.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard, Filter, Search, User, Calendar, Clock, DollarSign, MapPin } from "lucide-react";
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

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(`*, profile_centra_resident(id, first_name, last_name, avatar_url), job_leads(tradie_id)`) // Include job leads
        .or("status.eq.open,status.eq.available")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error.message);
      } else {
        setJobs(data);
      }
    };

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

    // Check existing leads count
    const { count } = await supabase
      .from("job_leads")
      .select("*", { count: "exact", head: true })
      .eq("job_id", job.id);

    if ((count ?? 0) >= (job.max_tradie_leads || 10)) {
      alert("Maximum number of tradies have already purchased this lead.");
      return;
    }

    // Save to job_leads
    await supabase.from("job_leads").insert({ job_id: job.id, tradie_id: user.id });

    // Check conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("homeowner_id", job.homeowner_id)
      .eq("tradie_id", user.id)
      .maybeSingle();

    let conversationId = existing?.id;

    if (!conversationId) {
      const { data: convo } = await supabase
        .from("conversations")
        .insert({ homeowner_id: job.homeowner_id, tradie_id: user.id, homeowner_replied: false })
        .select()
        .single();
      conversationId = convo?.id;
    }

    // Fetch tradie profile
    const { data: tradieProfile } = await supabase
      .from("profile_centra_tradie")
      .select("full_name, abn, license, rating, review_count, portfolio")
      .eq("id", user.id)
      .single();

    const message = `Hi, I'm ${tradieProfile?.full_name} and interested in your job.\n\nABN: ${tradieProfile?.abn}\nLicense: ${tradieProfile?.license || "N/A"}\nRating: ${tradieProfile?.rating || 0} (${tradieProfile?.review_count} reviews)`;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: message,
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
                  <Input
                    id="search"
                    placeholder="Search jobs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={selectedCategory === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(null)}>All</Badge>
                    {categories.map((cat) => (
                      <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(cat)}>{cat}</Badge>
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
                    <label htmlFor="emergency-only">Emergency jobs only</label>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-3 space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className={`p-4 space-y-3 border ${job.is_emergency ? "border-red-600 border-4" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span>{job.profile_centra_resident?.first_name || "Unknown"}</span>
                      {job.profile_centra_resident?.avatar_url && (
                        <img src={job.profile_centra_resident.avatar_url} className="h-8 w-8 rounded-full" />
                      )}
                    </div>
                    <Badge variant="outline">{job.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-muted-foreground text-sm">{job.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{job.location}</div>
                    <div className="flex items-center"><DollarSign className="h-4 w-4 mr-1" />{job.budget}</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{job.timeline}</div>
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{new Date(job.created_at).toLocaleDateString()}</div>
                  </div>
                  <Button onClick={() => handlePurchaseLead(job)}>Purchase Lead</Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
