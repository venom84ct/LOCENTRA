// src/pages/dashboard/tradie/profile.tsx

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
import { Star, MapPin, Phone, Trash } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: reviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("tradie_id", user.id);

      if (!error && data) {
        setProfile({
          ...data,
          portfolio: Array.isArray(data.portfolio)
            ? data.portfolio
            : typeof data.portfolio === "string"
            ? JSON.parse(data.portfolio)
            : [],
          reviews: reviews || [],
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
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold mt-2">{fullName}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" /> {profile.phone || "N/A"}
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" /> {profile.address || "No address"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Member since {joinDate}
                </div>
              </div>
              <div className="flex items-center justify-center mt-2 text-yellow-500">
                <Star className="w-4 h-4 mr-1" />
                {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing && (
                <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {editing ? (
                <>
                  <Textarea
                    placeholder="About Me"
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                  <Input
                    placeholder="ABN"
                    value={profile.abn || ""}
                    onChange={(e) => setProfile({ ...profile, abn: e.target.value })}
                  />
                  <Input
                    placeholder="License"
                    value={profile.license || ""}
                    onChange={(e) => setProfile({ ...profile, license: e.target.value })}
                  />
                  <Input
                    placeholder="Trade Category"
                    value={profile.trade_category || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, trade_category: e.target.value })
                    }
                  />
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPortfolioFiles(e.target.files)}
                  />
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <p><strong>About Me:</strong> {profile.bio || "N/A"}</p>
                  <p><strong>ABN:</strong> {profile.abn || "N/A"}</p>
                  <p><strong>License:</strong> {profile.license || "N/A"}</p>
                  <p><strong>Trade Category:</strong> {profile.trade_category || "N/A"}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(profile.portfolio || []).slice(0, 6).map((url: string, idx: number) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                  {editing && (
                    <button
                      onClick={() => handleDeleteImage(url)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.reviews?.length ? (
              profile.reviews.map((r: any, i: number) => (
                <div key={i} className="p-3 border rounded">
                  <p className="text-sm font-medium">{r.reviewer_name}</p>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
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
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
