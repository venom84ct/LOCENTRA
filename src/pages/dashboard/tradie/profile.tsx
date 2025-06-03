// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

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

    const updates: any = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      abn: profile.abn,
      license: profile.license,
      bio: profile.bio,
    };

    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });
      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from("tradie-avatars")
          .getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newUrls: string[] = [];
      const currentCount = profile.portfolio?.length || 0;
      const remainingSlots = 6 - currentCount;
      const filesToUpload = Array.from(portfolioFiles).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${Date.now()}-${file.name}`, file);
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage
            .from("portfolio")
            .getPublicUrl(data.path);
          newUrls.push(urlData.publicUrl);
        }
      }
      updates.portfolio = [...(profile.portfolio || []), ...newUrls];
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      const { data: updatedProfile } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", profile.id)
        .single();
      setProfile({
        ...updatedProfile,
        portfolio: Array.isArray(updatedProfile?.portfolio)
          ? updatedProfile.portfolio
          : [],
      });
      setEditing(false);
      setAvatarFile(null);
      setPortfolioFiles(null);
    } else {
      alert("Failed to save profile changes");
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
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold">{fullName}</p>
                <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
                <p className="text-muted-foreground">Phone: {profile.phone || "N/A"}</p>
                <p className="text-muted-foreground">ABN: {profile.abn || "N/A"}</p>
                <p className="text-muted-foreground">License: {profile.license || "N/A"}</p>
              </div>
              <Button onClick={() => setEditing(!editing)}>Edit Profile</Button>
            </div>
            {editing && (
              <div className="space-y-4">
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
                <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                <Input type="file" multiple onChange={(e) => setPortfolioFiles(e.target.files)} />
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
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
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
