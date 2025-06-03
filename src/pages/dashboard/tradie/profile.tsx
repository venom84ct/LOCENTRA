import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_PORTFOLIO_IMAGES = 6;

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);

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

  const handleSave = async () => {
    if (!profile) return;

    const updates: any = { ...profile };

    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });
      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from("tradie-avatars")
          .getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newUrls: string[] = [];
      const existing = Array.isArray(profile.portfolio) ? profile.portfolio : [];
      const remainingSlots = MAX_PORTFOLIO_IMAGES - existing.length;

      const files = Array.from(portfolioFiles).slice(0, remainingSlots);
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${Date.now()}-${file.name}`, file);
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(data.path);
          newUrls.push(urlData.publicUrl);
        }
      }
      updates.portfolio = [...existing, ...newUrls];
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile(updates);
    } else {
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  {profile.first_name?.[0]}
                  {profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            </div>

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

            <div className="space-y-2">
              <label className="font-medium">Upload Portfolio (max {MAX_PORTFOLIO_IMAGES})</label>
              <Input
                type="file"
                multiple
                disabled={(profile.portfolio?.length || 0) >= MAX_PORTFOLIO_IMAGES}
                onChange={(e) => setPortfolioFiles(e.target.files)}
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profile.portfolio?.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Portfolio ${idx + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
