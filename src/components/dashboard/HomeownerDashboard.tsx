import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  timeline: string;
  created_at: string;
  status: string;
  is_emergency?: boolean;
}

const HomeownerDashboard = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: jobList } = await supabase
        .from("jobs")
        .select("*")
        .eq("homeowner_id", user.id)
        .not("status", "eq", "completed") // ✅ exclude completed
        .not("status", "eq", "cancelled") // ✅ exclude cancelled
        .order("created_at", { ascending: false });

      setUserProfile(profile);
      setJobs(jobList || []);
    };

    fetchUserAndJobs();
  }, []);

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            Centra Resident Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="font-medium">{userProfile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {userProfile?.email}
              </p>
            </div>
            <Avatar>
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback>
                {userProfile?.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback>
                    {userProfile?.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{userProfile?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {userProfile?.created_at?.substring(0, 10)}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{userProfile?.address || "No address provided"}</span>
                </div>
                <div className="flex items-center">
                  <Gift className="h-4 w-4 mr-2" />
                  <span>{userProfile?.points || 0} reward points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your jobs and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/post-job">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/dashboard/messages")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = "/dashboard/rewards")}
              >
                <Gift className="mr-2 h-4 w-4" />
                Redeem Rewards
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Jobs */}
        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="grid grid-cols-1 gap-4 pt-4">
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
                    {renderStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{job.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.budget}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {job.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
