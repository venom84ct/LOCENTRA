import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Calendar, Upload } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { containsProfanity } from "@/lib/profanity";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    address: "",
    bio: "",
    avatar_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setFormData({
          address: data.address || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage.from("job-images").upload(filePath, file);
    if (!error) {
      const { data } = supabase.storage.from("job-images").getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (
      Object.values(formData).some(
        (v) => typeof v === "string" && containsProfanity(v)
      )
    ) {
      alert("Profanity is not allowed.");
      return;
    }

    const { error } = await supabase
      .from("profile_centra_resident")
      .update(formData)
      .eq("id", profile.id);

    if (!error) {
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const joinDate = new Date(profile.created_at).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout userType="centraResident" user={{ ...profile, full_name: fullName }}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white md:col-span-1">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={formData.avatar_url || profile.avatar_url} alt={fullName} />
                    <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{fullName}</CardTitle>
                  <CardDescription>Centra Resident</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{profile.email}</div>
                  <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{profile.phone}</div>
                  <div className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5" />{formData.address}</div>
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />Member since {joinDate}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white md:col-span-2">
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Profile" : "Profile Details"}</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your information below" : "Your personal information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <Input type="file" accept="image/*" onChange={handleAvatarUpload} />
                      {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">About Me</h3>
                      <p>{profile.bio || "No bio available."}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Security</h3>
                      <div className="flex justify-between items-center">
                        <span>Password</span>
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
