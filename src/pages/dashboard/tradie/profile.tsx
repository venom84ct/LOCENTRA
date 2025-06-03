import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Failed to get user:", userError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch profile:", error.message);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profile_centra_tradie")
      .update({
        first_name: profile.first_name,
        phone: profile.phone,
        address: profile.address,
        abn: profile.abn,
        license: profile.license,
        bio: profile.bio,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (error) {
      alert("❌ Failed to update profile");
    } else {
      alert("✅ Profile updated");
      setEditing(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!profile) return <div className="p-6 text-red-600">Profile not found.</div>;

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-AU", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <DashboardLayout userType="tradie">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.first_name?.[0] || "T"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{profile.first_name || "Tradie"}</CardTitle>
                <p className="text-sm text-muted-foreground">{profile.trade}</p>
                <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 mt-4">
            {editing ? (
              <>
                <Input name="first_name" value={profile.first_name || ""} onChange={handleChange} placeholder="Name" />
                <Input name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="Phone" />
                <Input name="address" value={profile.address || ""} onChange={handleChange} placeholder="Address" />
                <Input name="abn" value={profile.abn || ""} onChange={handleChange} placeholder="ABN" />
                <Input name="license" value={profile.license || ""} onChange={handleChange} placeholder="License" />
                <Textarea name="bio" value={profile.bio || ""} onChange={handleChange} placeholder="Bio / About" />
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profile.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profile.phone || "No phone provided"}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profile.address || "No address provided"}
                </div>
                <div className="flex items-center text-sm">
                  <BadgeCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  ABN: {profile.abn || "N/A"} | License: {profile.license || "N/A"}
                </div>
                {profile.bio && (
                  <div className="text-sm text-muted-foreground italic">{profile.bio}</div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
