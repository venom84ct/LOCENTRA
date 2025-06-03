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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface Review {
  reviewer_name: string;
  comment: string;
  rating: number;
}

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
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    const updates: any = { ...profile };

    // Upload avatar
    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("tradie-avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from("tradie-avatars").getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    // Upload new portfolio images
    if (portfolioFiles) {
      const existing = Array.isArray(profile.portfolio) ? profile.portfolio : [];
      if (existing.length + portfolioFiles.length > 6) {
        alert("Max 6 portfolio images allowed.");
        return;
      }

      const newUrls: string[] = [];
      for (const file of Array.from(portfolioFiles)) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${file.name}`, file);
        if (!error && data) {
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
      setEditing(false);
    } else {
      alert("Failed to save changes.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", { year: "numeric", month: "long" })
    : "Unknown";

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {!editing ? (
          <Card className="flex justify-between p-6 items-center">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-muted-foreground">{profile.bio || "No bio added."}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star className="w-4 h-4" />
                  {(profile.rating_avg || 0).toFixed(1)} ({profile.rating_count || 0} reviews)
                </div>
              </div>
            </div>
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </Card>
        ) : (
          <Card className="p-6 space-y-4">
            <CardTitle>Edit Profile</CardTitle>
            <div className="flex gap-4 items-center">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                placeholder="Address"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
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
            </div>
            <Textarea
              placeholder="Bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <div>
              <p className="font-medium mb-1">Add Portfolio Images (Max 6)</p>
              <Input type="file" multiple onChange={(e) => setPortfolioFiles(e.target.files)} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {(profile.portfolio || []).map((url: string, idx: number) => (
                  <img key={idx} src={url} alt={`Portfolio ${idx}`} className="rounded border h-32 object-cover" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {(profile.portfolio || []).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio.map((url: string, idx: number) => (
                  <img key={idx} src={url} className="h-32 w-full object-cover rounded border" />
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
          <CardContent>
            {(profile.reviews || []).length > 0 ? (
              <div className="space-y-3">
                {profile.reviews.map((r: Review, i: number) => (
                  <div key={i} className="border p-3 rounded">
                    <p className="text-sm font-medium">{r.reviewer_name}</p>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
