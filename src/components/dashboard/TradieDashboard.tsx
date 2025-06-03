import React from "react";
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
  ClipboardList,
  MessageSquare,
  PlusCircle,
} from "lucide-react";

interface TradieProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  address?: string;
  created_at?: string;
  credits?: number;
  rating_avg?: number;
  rating_count?: number;
  jobs?: { status: string }[];
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const activeJobs = profile.jobs?.filter((j) => j.status === "open").length || 0;
  const completedJobs = profile.jobs?.filter((j) => j.status === "completed").length || 0;
  const totalJobs = activeJobs + completedJobs;

  return (
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
              <div className="text-xs mt-1">
                <Gift className="inline h-4 w-4 mr-1" />
                {profile.credits || 0} credits
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
            <Button className="w-full" variant="default">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post a New Job
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button className="w-full" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Job History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradieDashboard;
