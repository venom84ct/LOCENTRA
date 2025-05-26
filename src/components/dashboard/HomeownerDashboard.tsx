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
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* User Profile Card */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">Member since {user.member_since || "2025"}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{user.address || "Not set"}</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.reward_points ?? 0} reward points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Summary Placeholder */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Job Summary</CardTitle>
            <CardDescription>Overview of your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded text-center">
                <p className="text-sm text-blue-600">Active</p>
                <p className="text-2xl font-bold">{realJobs.filter(j => j.status === "open" || j.status === "in_progress").length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold">{realJobs.filter(j => j.status === "completed").length}</p>
              </div>
              <div className="bg-red-50 p-3 rounded text-center">
                <p className="text-sm text-red-600">Cancelled</p>
                <p className="text-2xl font-bold">{realJobs.filter(j => j.status === "cancelled").length}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center">
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-2xl font-bold">{realJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex items-center justify-start" onClick={() => navigate("/post-job")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Job
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-start" onClick={() => navigate("/dashboard/messages")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-start" onClick={() => navigate("/dashboard/rewards")}>
              <Gift className="mr-2 h-4 w-4" />
              Redeem Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
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
