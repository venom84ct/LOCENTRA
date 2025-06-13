import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Phone, Trophy } from "lucide-react";

const PublicTradieProfilePage = () => {
  const { tradie_id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!tradie_id) return;

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", tradie_id)
        .single();

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("rating, comment, homeowner_id")
        .eq("tradie_id", tradie_id);

      const reviewerIds = reviewData?.map(r => r.homeowner_id) || [];

      const { data: reviewerProfiles } = await supabase
        .from("profile_centra_resident")
        .select("id, first_name, last_name, avatar_url")
        .in("id", reviewerIds);

      const reviewsWithNames = reviewData.map(r => {
        const reviewer = reviewerProfiles?.find(p => p.id === r.homeowner_id);
        return {
          ...r,
          reviewer_name: reviewer ? `${reviewer.first_name} ${reviewer.last_name}` : "Anonymous",
          reviewer_avatar: reviewer?.avatar_url || "",
        };
      });

      const ratingSum = reviewData?.reduce((sum, r) => sum + r.rating, 0) || 0;
      const ratingCount = reviewData?.length || 0;
      const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : 0;

      let fixedPortfolio: string[] = [];
      if (Array.isArray(profileData.portfolio)) {
        fixedPortfolio = profileData.portfolio;
      } else if (typeof profileData.portfolio === "string") {
        try {
          const parsed = JSON.parse(profileData.portfolio);
          if (Array.isArray(parsed)) fixedPortfolio = parsed;
        } catch {
          fixedPortfolio = [];
        }
      }

      setProfile({
        ...profileData,
        portfolio: fixedPortfolio,
        reviews: reviewsWithNames,
        rating_avg: ratingAvg,
        rating_count: ratingCount,
      });

      setLoading(false);
    };

    fetchProfile();
  }, [tradie_id]);

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <DashboardLayout userType="public" user={null}>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{(profile.first_name || "").slice(0, 2)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-bold mt-2">
              {profile.first_name} {profile.last_name}
            </CardTitle>
            {profile.weekly_badge === "gold" && (
              <div className="flex justify-center items-center mt-1 text-yellow-500">
                <Trophy className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Top Tradie</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="text-sm mt-2 space-y-1">
              <div className="flex items-center justify-center">
                <Phone className="h-4 w-4 mr-2" /> {profile.phone || "N/A"}
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-2" /> {profile.address || "N/A"}
              </div>
              <div className="flex items-center justify-center text-yellow-500">
                <Star className="w-4 h-4 mr-1" />
                {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
            <p><strong>ABN:</strong> {profile.abn || "N/A"}</p>
            <p><strong>License:</strong> {profile.license || "N/A"}</p>
            <p><strong>Trade Category:</strong> {profile.trade_category || "N/A"}</p>
          </CardContent>
        </Card>

        {profile.portfolio?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.reviews?.length ? (
              profile.reviews.map((r: any, i: number) => (
                <div key={i} className="p-3 border rounded flex gap-3 items-start">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={r.reviewer_avatar} />
                    <AvatarFallback>{r.reviewer_name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{r.reviewer_name}</p>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PublicTradieProfilePage;
