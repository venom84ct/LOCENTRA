import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Phone, MapPin, CheckCircle, Mail } from "lucide-react";

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
      if (!error) {
        const { data: urlData } = supabase.storage.from("tradie-avatars").getPublicUrl(data.path);
        updates.avatar_url = urlData.publicUrl;
      }
    }

    if (portfolioFiles) {
      const newUrls: string[] = [];
      for (const file of Array.from(portfolioFiles)) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .upload(`${profile.id}/${file.name}`, file, { upsert: false });
        if (!error && data?.path) {
          const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(data.path);
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
      setProfile(updates);
      setEditing(false);
    } else {
      alert("Failed to save profile changes.");
    }
  };

  if (loading) return <DashboardLayout userType="tradie"><div className="p-6">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout userType="tradie"><div className="p-6 text-red-600">Profile not found.</div></DashboardLayout>;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{profile.first_name} {profile.last_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{profile.trade || "Tradie"}</p>
              </div>
            </div>
            {!editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
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
                <div className="flex items-center text-sm"><Mail className="w-4 h-4 mr-2" /> {profile.email}</div>
                <div className="flex items-center text-sm"><Phone className="w-4 h-4 mr-2" /> {profile.phone}</div>
                <div className="flex items-center text-sm"><MapPin className="w-4 h-4 mr-2" /> {profile.address}</div>
                <div className="flex items-center text-sm"><CheckCircle className="w-4 h-4 mr-2" /> ABN: {profile.abn}, License: {profile.license}</div>
                <div className="flex items-center text-sm"><Star className="w-4 h-4 mr-2 text-yellow-500" /> {profile.rating_avg?.toFixed(1) || "0.0"} ({profile.rating_count || 0} reviews)</div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(profile.portfolio || []).map((url: string, idx: number) => (
                <img key={idx} src={url} alt={`Portfolio ${idx}`} className="w-full h-32 object-cover rounded border" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
