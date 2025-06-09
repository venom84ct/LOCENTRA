
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";

const HomeownerJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  const fetchJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("jobs")
      .select("*, profile_centra_tradie(id, first_name, last_name, avatar_url)")
      .eq("homeowner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setJobs(data || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleImageClick = (url: string) => setImageModalUrl(url);
  const closeImageModal = () => setImageModalUrl(null);

  return (
    <DashboardLayout userType="centraResident">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Posted Jobs</h1>

        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card
              key={job.id}
              className={`bg-white p-4 mb-4 border ${
                job.is_emergency ? "border-red-600 border-2" : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  {job.is_emergency && (
                    <Badge variant="destructive">Emergency</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-2">{job.description}</p>

                {Array.isArray(job.image_urls) && job.image_urls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto mb-3">
                    {job.image_urls.map((url: string, idx: number) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Job"
                        onClick={() => handleImageClick(url)}
                        className="h-20 w-28 object-cover rounded cursor-pointer border"
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
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

                {job.assigned_tradie && job.profile_centra_tradie ? (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-sm mb-1 text-muted-foreground">
                      Assigned Tradie
                    </p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {job.profile_centra_tradie.first_name}{" "}
                        {job.profile_centra_tradie.last_name}
                      </span>
                      {job.profile_centra_tradie.avatar_url && (
                        <img
                          src={job.profile_centra_tradie.avatar_url}
                          alt="Tradie Avatar"
                          className="h-6 w-6 rounded-full ml-2"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
                    <Badge variant="outline">Not yet assigned</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white">
            <CardContent className="py-10 text-center">
              <AlertCircle className="w-6 h-6 mb-2 text-muted-foreground mx-auto" />
              <p>You haven’t posted any jobs yet.</p>
            </CardContent>
          </Card>
        )}

        {imageModalUrl && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="relative bg-white p-4 rounded shadow-lg">
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 text-black hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={imageModalUrl}
                alt="Full size"
                className="max-h-[80vh] max-w-[90vw]"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HomeownerJobsPage;
