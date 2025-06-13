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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Trash, Trophy } from "lucide-react";

const TradieProfilePage = () => {
  const { id: publicTradieId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loggedInId, setLoggedInId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);

  const isPublic = !!publicTradieId;
  const tradieId = isPublic ? publicTradieId : loggedInId;

  useEffect(() => {
    const fetchProfile = async () => {
      const authUser = await supabase.auth.getUser();
      const uid = authUser.data.user?.id || null;
      setLoggedInId(uid);

      if (!tradieId) return;

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", tradieId)
        .single();

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("rating, comment, homeowner_id, job_id")
        .eq("tradie_id", tradieId);

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
          await supabase.from("profile_centra_tradie").update({ portfolio: [] }).eq("id", tradieId);
        }
      }

      setProfile({
        ...profileData,
        portfolio: fixedPortfolio,
        reviews: reviewsWithNames,
        rating_avg: ratingAvg,
        rating_count: ratingCount,
      });
    };

    fetchProfile();
  }, [tradieId]);

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
      const { data } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });
      if (data) {
        const url = supabase.storage.from("tradie-avatars").getPublicUrl(data.path);
        updates.avatar_url = url.data.publicUrl;
      }
    }

    if (portfolioFiles) {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(portfolioFiles).slice(0, 6)) {
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-z0-9.\-_]/gi, "_").toLowerCase();
        const filePath = `${profile.id}/${timestamp}_${cleanName}`;
        const { data } = await supabase.storage.from("portfolio").upload(filePath, file);
        if (data) {
          const url = supabase.storage.from("portfolio").getPublicUrl(data.path);
          uploadedUrls.push(url.data.publicUrl);
        }
      }
      updates.portfolio = [...(profile.portfolio || []), ...uploadedUrls];
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...updates });
      setEditing(false);
    }
  };

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tradie Profile</h1>
          {!isPublic && !editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
        </div>

        {profile?.first_name ? (
          <>
            <Card>
              <CardHeader>
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>{profile.first_name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{profile.first_name} {profile.last_name}</CardTitle>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="text-sm mt-1">
                  <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {profile.phone || "N/A"}</div>
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {profile.address || "No address"}</div>
                </div>
                <div className="flex items-center mt-2 text-yellow-500">
                  <Star className="w-4 h-4 mr-1" /> {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>
                {editing ? (
                  <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                ) : (
                  <p>{profile.bio || "No bio available."}</p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <p>Profile not found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
