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
  DollarSign,
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
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profile_centra_tradie")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser(profile);

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

  const handlePurchaseLead = async (job: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tradieId = user.id;

    const { data: tradieProfile } = await supabase
      .from("profile_centra_tradie")
      .select("first_name, abn, license, rating_avg")
      .eq("id", tradieId)
      .single();

    const { data: conversation } = await supabase
      .from("conversations")
      .insert({ job_id: job.id, homeowner_id: job.homeowner_id, tradie_id: tradieId })
      .select()
      .single();

    await supabase.from("job_leads").insert([{ job_id: job.id, tradie_id: tradieId }]);

    const autoMessage = `Hi! I'm interested in this job. Here's a bit about me:\n- ABN: ${tradieProfile.abn}\n- License: ${tradieProfile.license}\n- Rating: ${tradieProfile.rating_avg?.toFixed(1) || "N/A"}`;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: tradieId,
      message: autoMessage,
    });

    await fetchJobs();
    navigate(`/dashboard/tradie/messages?conversationId=${conversation.id}&jobId=${job.id}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    const matchesEmergency = showEmergencyOnly ? job.is_emergency === true : true;

    const isAssigned = !!job.assigned_tradie;
    const isPurchased = purchasedLeads.includes(job.id);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesEmergency &&
      !isPurchased &&
      !isAssigned
    );
  });

  if (!user) return null;

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Find Jobs</h1>
        <div className="mb-4">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className={`p-4 ${job.is_emergency ? "border-red-500 border-2" : "border"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={job.profile_centra_resident?.avatar_url || "https://via.placeholder.com/40"}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm">{job.profile_centra_resident?.first_name || "Homeowner"}</span>
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
                  <Calendar className="h-4 w-4 mr-1" /> {new Date(job.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" /> {job.budget}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {job.timeline}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => handlePurchaseLead(job)}>Purchase Lead</Button>
              </div>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
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
    </DashboardLayout>
  );
};

export default FindJobsPage;
