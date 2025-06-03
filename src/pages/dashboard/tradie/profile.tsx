import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Mail, Phone, MapPin } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
        setProfile({ ...data, portfolio: data.portfolio || [] });
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

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage
          .from("tradie-avatars")
          .getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("profile_centra_tradie")
      .update(updates)
      .eq("id", profile.id);

    if (!error) {
      setProfile(updates);
      setEditing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">Tradie</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {profile.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile.address || "-"}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {joinDate}
                </p>
              </div>
              {editing && (
                <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    <strong>About Me</strong>
                    <br />
                    {profile.bio || "No bio provided."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>ABN:</strong> {profile.abn || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>License:</strong> {profile.license || "-"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(profile.reviews || []).map((review: any, index: number) => (
              <div key={index} className="p-3 border rounded">
                <p className="text-sm font-medium">{review.reviewer}</p>
                <p className="text-sm text-muted-foreground">"{review.comment}"</p>
                <div className="flex items-center text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
