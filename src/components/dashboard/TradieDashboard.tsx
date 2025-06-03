import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Star,
  Hammer,
  Briefcase,
} from "lucide-react";

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
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Credits</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {profile.credits ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2 text-yellow-500 text-xl font-semibold">
            <Star className="w-5 h-5" />
            <span>{profile.rating_avg?.toFixed(1) ?? "0.0"}</span>
            <span className="text-sm text-muted-foreground">
              ({profile.rating_count ?? 0} reviews)
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {profile.previousJobs?.length ?? 0}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {/* Buttons or links will go here */}
            No actions available yet.
          </CardContent>
        </Card>
      </div>

      {/* Tradie Profile Info */}
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>
              {profile?.first_name?.[0]}
              {profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">
              {profile?.first_name} {profile?.last_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{profile?.trade || "Your Trade"}</p>
            <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.email}
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            {profile?.address || "No address provided"}
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" />
            ABN: {profile?.abn || "N/A"}, License: {profile?.license || "N/A"}
          </div>
          <div className="text-sm">
            <Badge variant="outline">Status: {profile?.status || "pending"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
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
            <p className="text-sm text-muted-foreground">
              No portfolio images uploaded.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Jobs */}
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
            <p className="text-sm text-muted-foreground">
              No previous jobs found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradieDashboard;
