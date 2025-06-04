// src/pages/dashboard/find-jobs.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CreditCard,
  Filter,
  Search,
  User,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [purchasedJobIds, setPurchasedJobIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchPurchasedLeads();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, profile_centra_resident(id, first_name, last_name, avatar_url)")
      .or("status.eq.open,status.eq.available")
      .order("created_at", { ascending: false });

    if (!error) setJobs(data);
  };

  const fetchPurchasedLeads = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) return;

    const { data, error } = await supabase
      .from("job_leads")
      .select("job_id")
      .eq("tradie_id", user.id);

    if (!error && data) setPurchasedJobIds(data.map((d) => d.job_id));
  };

  const handlePurchaseLead = async (job: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;

    const { data: convo } = await supabase
      .from("conversations")
      .insert({ homeowner_id: job.homeowner_id, tradie_id: user.id, job_id: job.id })
      .select("id")
      .single();

    if (convo) {
      await fetchPurchasedLeads();
      navigate(`/dashboard/tradie/messages?conversationId=${convo.id}`);
    }
  };

  const categories = Array.from(new Set(jobs.map((job) => job.category)));

  return (
    <DashboardLayout userType="tradie">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Find Jobs</h1>
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">Credits Available</span>
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
                    <label htmlFor="search" className="text-sm font-medium">
                      Search
                    </label>
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
                      <Badge
                        variant={selectedCategory === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory(null);
                        setShowEmergencyOnly(false);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <div className="grid grid-cols-1 gap-4">
                {jobs
                  .filter((job) => {
                    const match =
                      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
                    return (
                      match &&
                      (selectedCategory ? job.category === selectedCategory : true) &&
                      (showEmergencyOnly ? job.is_emergency === true : true)
                    );
                  })
                  .map((job) => {
                    const isPurchased = purchasedJobIds.includes(job.id);
                    return (
                      <Card
                        key={job.id}
                        className={`bg-white border rounded-lg p-4 space-y-4 ${
                          job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                        }`}
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

                        <div className="space-y-1">
                          <h2 className="text-lg font-semibold">{job.title}</h2>
                          <p className="text-muted-foreground text-sm">{job.description}</p>
                          <p className="text-sm"><MapPin className="inline h-4 w-4 mr-1" /> {job.location}</p>
                          <p className="text-sm"><DollarSign className="inline h-4 w-4 mr-1" /> ${job.budget}</p>
                          <p className="text-sm"><Calendar className="inline h-4 w-4 mr-1" /> {job.timeline}</p>
                          <p className="text-sm font-medium">Category: {job.category}</p>
                        </div>

                        {isPurchased ? (
                          <>
                            <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Purchased</Badge>
                            <Button variant="destructive" onClick={() => navigate(`/dashboard/tradie/messages?jobId=${job.id}`)}>
                              Message
                            </Button>
                          </>
                        ) : (
                          <Button onClick={() => handlePurchaseLead(job)}>Purchase Lead</Button>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
