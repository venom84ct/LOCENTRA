import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Gift,
  MapPin,
  MessageSquare,
  PlusCircle,
  Star,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  location: string;
  category: string;
  budget: string;
  is_emergency: boolean;
  tradie_id?: string;
  image_urls?: string[];
}

const CentraResidentDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && jobsData) {
        setJobs(jobsData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const renderStatus = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>;
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Jobs</h2>
              <Button asChild>
                <Link to="/post-job">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post New Job
                </Link>
              </Button>
            </div>

            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-600">No jobs posted yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`bg-white ${
                      job.is_emergency ? "border-4 border-red-600" : ""
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            {job.is_emergency && (
                              <Badge variant="destructive" className="ml-2">
                                Emergency
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{job.category}</CardDescription>
                        </div>
                        {renderStatus(job.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{job.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm">{job.location}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date Posted</p>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm">
                              {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm">{job.budget}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <p className="text-sm capitalize">{job.status}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <p>Messages tab content coming soon.</p>
          </TabsContent>

          <TabsContent value="rewards">
            <p>Rewards tab content coming soon.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CentraResidentDashboard;
