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
        .from("avatars")
        .upload(`${profile.id}/avatar.png`, avatarFile, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newPortfolioUrls: string[] = [];
      for (const file of Array.from(portfolioFiles)) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${file.name}`, file, { upsert: false });
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(data.path);
          newPortfolioUrls.push(urlData.publicUrl);
        }
      }
      updates.portfolio = [...(profile.portfolio || []), ...newPortfolioUrls];
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile(updates);
      setEditing(false);
    } else {
      alert("Failed to save profile changes");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Tradie Profile</CardTitle>
            <Button onClick={() => setEditing(!editing)} variant="outline">
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
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
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setPortfolioFiles(e.target.files)}
                />
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.first_name?.[0]}
                      {profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                </div>
                <p className="text-sm">ABN: {profile.abn || "N/A"}</p>
                <p className="text-sm">License: {profile.license || "N/A"}</p>
                <p className="text-sm">Bio: {profile.bio || "N/A"}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(profile.portfolio || []).map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`Portfolio ${idx}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Dynamic review fetching can be added here */}
            <div className="p-3 border rounded">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-sm text-muted-foreground">
                "Excellent service, would recommend!"
              </p>
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
