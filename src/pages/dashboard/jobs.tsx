// Updated FindJobsPage
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
  X,
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
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const isAssignedToAnother = job.assigned_tradie && !purchasedLeads.includes(job.id);

    return matchesSearch && matchesCategory && matchesEmergency && !isAssignedToAnother;
  });

  const handleImageClick = (url: string) => setImageModalUrl(url);

  const closeImageModal = () => setImageModalUrl(null);

  return (
    <DashboardLayout userType="tradie">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Find Jobs</h1>
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
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const profile = job.profile_centra_resident;
                return (
                  <Card
                    key={job.id}
                    className={`bg-white p-4 border ${
                      job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {profile?.first_name || "Unknown"} {profile?.last_name || ""}
                      </span>
                      {profile?.avatar_url && (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="h-6 w-6 rounded-full ml-2"
                        />
                      )}
                      {job.is_emergency && (
                        <Badge variant="destructive" className="ml-auto">Emergency</Badge>
                      )}
                    </div>

                    <h2 className="text-lg font-semibold mb-1">{job.title}</h2>
                    <p className="text-muted-foreground text-sm mb-2">{job.description}</p>

                    {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto mb-3">
                        {job.image_urls.map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt="Job image"
                            onClick={() => handleImageClick(url)}
                            className="h-20 w-28 object-cover rounded cursor-pointer border"
                          />
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 text-sm text-muted-foreground gap-2 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" /> {job.budget}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {job.timeline}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => navigate(`/dashboard/tradie/messages?jobId=${job.id}`)}>
                        Message
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-white">
                <CardContent className="py-10 text-center">
                  <AlertCircle className="w-6 h-6 mb-2 text-muted-foreground mx-auto" />
                  <p>No jobs found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {imageModalUrl && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="relative bg-white p-4 rounded shadow-lg">
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 text-black hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={imageModalUrl} alt="Full size" className="max-h-[80vh] max-w-[90vw]" />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindJobsPage;
