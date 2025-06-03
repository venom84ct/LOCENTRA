// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
        year: "numeric",
        month: "long",
      })
    : "Unknown";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{profile.first_name?.[0] || "T"}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{fullName}</h2>
          <p className="text-sm text-muted-foreground mb-1">
            {profile.bio || "No bio added."}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {profile.rating_avg?.toFixed(1) || "0.0"} (
            {profile.rating_count || 0} reviews)
          </div>
          <Button variant="default" onClick={() => location.href = "/dashboard/tradie/profile/edit"}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.portfolio?.length ? (
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

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.reviews?.length ? (
            profile.reviews.map((review: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-md space-y-1">
                <p className="font-medium">{review.reviewer_name}</p>
                <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                <div className="flex text-yellow-500">
                  {[...Array(review.rating || 0)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TradieProfilePage;
