import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, CheckCircle, Star } from "lucide-react";

interface Job {
  title: string;
}

interface TradieProfile {
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
    ? new Date(profile.created_at).toLocaleDateString("en-AU", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Jobs Completed</p>
            <p className="text-xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <p className="text-xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="text-xl font-bold">{profile?.rating_avg?.toFixed(1) || "0.0"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="text-xl font-bold">{joinDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>Coming soon...</p>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold">
                {profile?.first_name} {profile?.last_name || "Tradie"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{profile?.trade || "Your Trade"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              {profile?.phone}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              {profile?.address || "No address provided"}
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              ABN: {profile?.abn || "N/A"}, License: {profile?.license || "N/A"}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {profile?.rating_avg?.toFixed(1) || "0.0"} ({profile?.rating_count || 0} reviews)
            </div>
            <div>
              <Badge variant="outline">Status: {profile?.status || "pending"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradieDashboard;
