// src/components/dashboard/TradieDashboard.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle, Clock, Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TradieProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  abn?: string;
  license?: string;
  bio?: string;
  jobSummary?: {
    total: number;
    completed: number;
    inProgress: number;
    emergency: number;
  };
}

const TradieDashboard = ({ profile }: { profile: TradieProfile }) => {
  const {
    first_name,
    last_name,
    avatar_url,
    phone,
    abn,
    license,
    bio,
    jobSummary = { total: 0, completed: 0, inProgress: 0, emergency: 0 },
  } = profile;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <Briefcase className="text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
              <p className="text-xl font-semibold">{jobSummary.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <CheckCircle className="text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-semibold">{jobSummary.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <Clock className="text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-xl font-semibold">{jobSummary.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <Zap className="text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Emergency</p>
              <p className="text-xl font-semibold">{jobSummary.emergency}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar_url} />
                <AvatarFallback>
                  {first_name?.[0]}
                  {last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {first_name} {last_name}
                </h2>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">ABN: {abn || "N/A"}</p>
            <p className="text-sm text-muted-foreground">License: {license || "N/A"}</p>
            <p className="text-sm">{bio || "No bio provided."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradieDashboard;
