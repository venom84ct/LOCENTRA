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
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.name?.substring(0, 2) || "T"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{profile?.name || "Tradie"}</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(profile?.portfolio) && profile.portfolio.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.portfolio.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No portfolio images uploaded.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {profile?.previousJobs?.length ? (
            profile.previousJobs.map((job, index) => (
              <div key={index} className="p-2 border rounded text-sm">
                {job.title}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No previous jobs found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradieDashboard;
