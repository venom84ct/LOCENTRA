import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Trash, Trophy, Medal } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("rating, comment, reviewer_name")
        .eq("tradie_id", user.id);

      if (!profileError && profileData) {
        let fixedPortfolio: string[] = [];

        if (Array.isArray(profileData.portfolio)) {
          fixedPortfolio = profileData.portfolio;
        } else if (typeof profileData.portfolio === "string") {
          try {
            const parsed = JSON.parse(profileData.portfolio);
            if (Array.isArray(parsed)) {
              fixedPortfolio = parsed;
            }
          } catch {
            await supabase
              .from("profile_centra_tradie")
              .update({ portfolio: [] })
              .eq("id", user.id);
          }
        }

        const ratingSum = reviewData?.reduce((sum, r) => sum + r.rating, 0) || 0;
        const ratingCount = reviewData?.length || 0;
        const ratingAvg = ratingCount > 0 ? ratingSum / ratingCount : 0;

        await supabase
          .from("profile_centra_tradie")
          .update({
            rating_avg: ratingAvg,
            rating_count: ratingCount,
          })
          .eq("id", user.id);

        setProfile({
          ...profileData,
          portfolio: fixedPortfolio,
          reviews: reviewData || [],
          rating_avg: ratingAvg,
          rating_count: ratingCount,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleDeleteImage = async (url: string) => {
    const filePath = url.split("/storage/v1/object/public/portfolio/")[1];
    await supabase.storage.from("portfolio").remove([filePath]);
    const updatedPortfolio = profile.portfolio.filter((img: string) => img !== url);
    setProfile({ ...profile, portfolio: updatedPortfolio });
    await supabase
      .from("profile_centra_tradie")
      .update({ portfolio: updatedPortfolio })
      .eq("id", profile.id);
  };

  const handleSave = async () => {
    if (!profile) return;

    const updates: any = {
      bio: profile.bio || null,
      abn: profile.abn || null,
      license: profile.license || null,
      trade_category: profile.trade_category || null,
      portfolio: profile.portfolio || [],
    };

    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });

      if (!error && data) {
        const { data: url } = supabase.storage
          .from("tradie-avatars")
          .getPublicUrl(data.path);
        updates.avatar_url = url.publicUrl;
      }
    }

    if (portfolioFiles) {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(portfolioFiles).slice(0, 6)) {
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-z0-9.\-_]/gi, "_").toLowerCase();
        const filePath = `${profile.id}/${timestamp}_${cleanName}`;

        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(filePath, file, { upsert: false });

        if (!error && data) {
          const { data: url } = supabase.storage
            .from("portfolio")
            .getPublicUrl(data.path);
          uploadedUrls.push(url.publicUrl);
        } else {
          alert(`Upload failed for ${file.name}: ${error?.message}`);
        }
      }

      const combinedPortfolio = [...(profile.portfolio || []), ...uploadedUrls];
      updates.portfolio = combinedPortfolio;
      setProfile((prev: any) => ({ ...prev, portfolio: combinedPortfolio }));
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
      setEditing(false);
    } else {
      alert("Failed to update profile: " + error.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
        </div>

        {profile?.first_name ? (
          <>
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
                    <span className="text-sm font-medium">Top Tradie of the Week</span>
                  </div>
                )}
                {profile.weekly_badge === "silver" && (
                  <div className="flex justify-center items-center mt-1 text-gray-400">
                    <Medal className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">2nd Place This Week</span>
                  </div>
                )}
                {profile.weekly_badge === "bronze" && (
                  <div className="flex justify-center items-center mt-1 text-amber-700">
                    <Medal className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">3rd Place This Week</span>
                  </div>
                )}

                <p className="text-muted-foreground">{profile.email}</p>
                <div className="text-sm mt-2 space-y-1">
                  <div className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" /> {profile.phone || "N/A"}
                  </div>
                  <div className="flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-2" /> {profile.address || "No address"}
                  </div>
                </div>
                <div className="flex items-center justify-center mt-2 text-yellow-500">
                  <Star className="w-4 h-4 mr-1" />
                  {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
                </div>
              </CardHeader>
              <CardContent>{editing && <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.reviews?.length ? (
                  profile.reviews.map((r: any, i: number) => (
                    <div key={i} className="p-3 border rounded">
                      <p className="text-sm font-medium">{r.reviewer_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{r.comment || "No comment"}</p>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4" />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No reviews available.</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-muted-foreground">Profile is empty. Please complete your details.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
