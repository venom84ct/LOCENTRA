import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Gift,
  MessageSquare,
  PlusCircle,
  Star,
  Hammer,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface TradieProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  address?: string;
  created_at?: string;
  credits?: number;
  rating_avg?: number;
  rating_count?: number;
  trade_category?: string;
  jobs?: { status: string }[];
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  const navigate = useNavigate();
  const [jobStats, setJobStats] = useState({ active: 0, completed: 0, total: 0 });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!profile?.id) return;

      const { data } = await supabase
        .from("jobs")
        .select("status")
        .or(`tradie_id.eq.${profile.id},assigned_tradie.eq.${profile.id}`);

      if (data) {
        const active = data.filter((j) => j.status !== "completed" && j.status !== "cancelled").length;
        const completed = data.filter((j) => j.status === "completed").length;
        const total = data.length;
        setJobStats({ active, completed, total });
      }
    };

    fetchJobs();
  }, [profile?.id]);

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const activeJobs = jobStats.total ? jobStats.active : profile.jobs?.filter((j) => j.status !== "completed" && j.status !== "cancelled").length || 0;
  const completedJobs = jobStats.total ? jobStats.completed : profile.jobs?.filter((j) => j.status === "completed").length || 0;
  const totalJobs = jobStats.total ? jobStats.total : profile.jobs?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Tradie Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to Home</Link>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{fullName.slice(0, 2).toUpperCase() || "TR"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{fullName.slice(0, 2).toUpperCase() || "TR"}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold">{fullName || "Tradie"}</p>
              <p className="text-muted-foreground">Member since {joinDate}</p>
              {profile.address && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" /> {profile.address}
                </div>
              )}
              {profile.trade_category && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Hammer className="h-4 w-4 mr-1" /> {profile.trade_category}
                </div>
              )}
              <div className="text-xs mt-1">
                <Link to="/dashboard/tradie/wallet" className="hover:underline flex items-center">
                  <Gift className="inline h-4 w-4 mr-1" />
                  {profile.credits || 0} credits
                </Link>
              </div>
              <div className="text-xs text-yellow-500 flex items-center mt-1">
                <Star className="h-4 w-4 mr-1" />
                {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Job Summary</CardTitle>
            <CardDescription>Overview of your job activity</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Active Jobs</span>
              <span>{activeJobs}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span>{completedJobs}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Jobs</span>
              <span>{totalJobs}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your jobs and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              variant="default"
              onClick={() => navigate("/dashboard/tradie/my-jobs")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Purchased Leads
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/dashboard/tradie/messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/dashboard/tradie/wallet")}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  );
};

export default TradieDashboard;
