// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

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

  return (
    <DashboardLayout userType="tradie">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6 text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl font-bold">{fullName}</CardTitle>
            <p className="text-muted-foreground">
              {profile.bio || "No bio added."}
            </p>
            <div className="flex justify-center items-center space-x-1 mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
              </span>
            </div>
            <div className="mt-4">
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No portfolio images uploaded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.reviews?.length ? (
              <div className="space-y-3">
                {profile.reviews.map((r: any, i: number) => (
                  <div key={i} className="border p-3 rounded">
                    <p className="text-sm font-medium">{r.reviewer_name}</p>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No reviews available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
