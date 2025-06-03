// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

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

  const handleSave = async () => {
    if (!profile) return;

    const updates: any = { ...profile };

    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from("tradie-avatars").getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newPortfolioUrls: string[] = [];
      const existing = profile.portfolio || [];
      if (existing.length + portfolioFiles.length > 6) {
        alert("You can upload a maximum of 6 portfolio images.");
        return;
      }
      for (const file of Array.from(portfolioFiles)) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${file.name}`, file);
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(data.path);
          newPortfolioUrls.push(urlData.publicUrl);
        }
      }
      updates.portfolio = [...existing, ...newPortfolioUrls];
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile(updates);
      setEditing(false);
    } else {
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  return (
    <DashboardLayout userType="tradie">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tradie Profile</CardTitle>
              <Button onClick={() => setEditing((prev) => !prev)}>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {editing && <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />}
            </div>
            {editing ? (
              <>
                <Input
                  placeholder="First Name"
                  value={profile.first_name || ""}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
                <Input
                  placeholder="Last Name"
                  value={profile.last_name || ""}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
                <Textarea
                  placeholder="Bio"
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
                <Input type="file" multiple onChange={(e) => setPortfolioFiles(e.target.files)} />
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">{fullName}</p>
                <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1" />
                  {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
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
