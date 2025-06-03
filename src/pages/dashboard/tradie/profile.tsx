import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Image as ImageIcon, Calendar } from "lucide-react";

const TradieDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<FileList | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
        .upload(`${profile.id}/avatar.png`, avatarFile, {
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from("tradie-avatars")
          .getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newPortfolioUrls: string[] = [];
      for (const file of Array.from(portfolioFiles)) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${file.name}`, file, {
            upsert: false,
          });
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage
            .from("portfolio")
            .getPublicUrl(data.path);
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
      const { data: refreshed } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", profile.id)
        .single();

      setProfile({
        ...refreshed,
        portfolio: Array.isArray(refreshed?.portfolio)
          ? refreshed.portfolio
          : [],
      });
      setIsEditing(false);
    } else {
      alert("❌ Failed to save profile changes");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Briefcase className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <p className="text-xl font-semibold">8</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Briefcase className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-xl font-semibold">4.5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Briefcase className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Find Jobs</p>
                <Button variant="link">Browse</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <ImageIcon className="w-6 h-6 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Manage Portfolio</p>
                <Button variant="link">Update</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Calendar className="w-6 h-6 text-teal-500" />
              <div>
                <p className="text-sm text-muted-foreground">Availability</p>
                <Button variant="link">Set</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>My Profile</CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
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
              {isEditing && (
                <Input
                  type="file"
                  onChange={(e) =>
                    setAvatarFile(e.target.files?.[0] || null)
                  }
                />
              )}
            </div>

            {isEditing ? (
              <>
                <Input
                  placeholder="First Name"
                  value={profile.first_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  value={profile.last_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="ABN"
                  value={profile.abn || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, abn: e.target.value })
                  }
                />
                <Input
                  placeholder="License"
                  value={profile.license || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, license: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Bio"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setPortfolioFiles(e.target.files)}
                />
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {profile.first_name} {profile.last_name}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>ABN:</strong> {profile.abn}
                </p>
                <p>
                  <strong>License:</strong> {profile.license}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio || "N/A"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
           
::contentReference[oaicite:0]{index=0}
 
