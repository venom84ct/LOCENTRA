import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Phone, Mail, MapPin, BadgeCheck } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile({
          ...data,
          portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center text-center space-y-2 py-8">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{fullName || "Tradie"}</h2>
            <p className="text-sm text-muted-foreground">
              {profile.bio || "No bio added."}
            </p>
            <div className="flex items-center text-sm text-muted-foreground space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>
                {(profile.rating_avg || 0).toFixed(1)} ({profile.rating_count || 0} reviews)
              </span>
            </div>
            <Button className="mt-2" variant="default" asChild>
              <a href="/dashboard/tradie/profile?edit=true">Edit Profile</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                {profile.email}
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                {profile.phone}
              </div>
            )}
            {profile.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                {profile.address}
              </div>
            )}
            <div className="flex items-center">
              <BadgeCheck className="w-4 h-4 mr-2 text-muted-foreground" />
              ABN: {profile.abn || "N/A"}, License: {profile.license || "N/A"}
            </div>
            <div className="text-muted-foreground">Member since {joinDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Max 6 images</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.portfolio?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio.slice(0, 6).map((url: string, idx: number) => (
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
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
