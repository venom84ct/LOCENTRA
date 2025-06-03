import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, CheckCircle, Star } from "lucide-react";

interface Job {
  title: string;
}

interface TradieProfile {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  trade?: string;
  license?: string;
  abn?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  credits?: number;
  rewards_points?: number;
  rating_avg?: number;
  rating_count?: number;
  status?: string;
  portfolio?: string[];
  previousJobs?: Job[];
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.first_name?.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{fullName || "Tradie"}</CardTitle>
            <p className="text-sm text-muted-foreground">{profile?.trade || "Your Trade"}</p>
            <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.phone}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.address || "No address provided"}
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" />
            ABN: {profile?.abn || "N/A"}, License: {profile?.license || "N/A"}
          </div>
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            {profile?.rating_avg?.toFixed(1) || "0.0"} ({profile?.rating_count || 0} reviews)
          </div>
          <div className="text-sm">
            <Badge variant="outline">Status: {profile?.status || "pending"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Job Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{profile?.previousJobs?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.credits ?? 0}</p>
            <p className="text-sm text-muted-foreground">Credits</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.rewards_points ?? 0}</p>
            <p className="text-sm text-muted-foreground">Reward Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.rating_avg?.toFixed(1) || "0.0"}</p>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradieDashboard;
