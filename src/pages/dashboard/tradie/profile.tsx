import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";

interface TradieProfile {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  abn: string | null;
  license: string | null;
  bio: string | null;
  portfolio: string[] | null;
}

export default function TradieProfilePage() {
  const session = useSession();
  const user = session?.user;
  const [profile, setProfile] = useState<TradieProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (!user) return;

      // Try to fetch existing profile
      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        // No profile found, create a new one
        const { data: newProfile, error: insertError } = await supabase
          .from("profile_centra_tradie")
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          setProfile(newProfile);
        }
      } else if (data) {
        setProfile(data);
      } else if (error) {
        console.error("Error fetching profile:", error);
      }

      setLoading(false);
    };

    fetchOrCreateProfile();
  }, [user]);

  const handleChange = (field: keyof TradieProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    const { data, error } = await supabase
      .from("profile_centra_tradie")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        abn: profile.abn,
        license: profile.license,
        bio: profile.bio,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setProfile(data);
      alert("Profile updated successfully.");
    }
  };

  if (loading) return <DashboardLayout><div className="p-4">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div className="p-4">Error loading profile.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Tradie Profile</h1>

        <div className="space-y-2">
          <label>First Name</label>
          <Input
            value={profile.first_name || ""}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />

          <label>Last Name</label>
          <Input
            value={profile.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />

          <label>ABN</label>
          <Input
            value={profile.abn || ""}
            onChange={(e) => handleChange("abn", e.target.value)}
          />

          <label>License</label>
          <Input
            value={profile.license || ""}
            onChange={(e) => handleChange("license", e.target.value)}
          />

          <label>Bio</label>
          <Input
            value={profile.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </DashboardLayout>
  );
}
