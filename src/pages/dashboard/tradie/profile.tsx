// src/pages/dashboard/tradie/profile.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TradieProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) return;

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
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
    if (error) alert("❌ Failed to save profile.");
    else alert("✅ Profile updated.");
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <DashboardLayout userType="tradie">
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

        <Input
          name="first_name"
          value={profile.first_name || ""}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <Input
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <Input
          name="address"
          value={profile.address || ""}
          onChange={handleChange}
          placeholder="Address"
        />

        <Input
          name="abn"
          value={profile.abn || ""}
          onChange={handleChange}
          placeholder="ABN"
        />

        <Input
          name="license"
          value={profile.license || ""}
          onChange={handleChange}
          placeholder="License"
        />

        <Textarea
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          placeholder="Short bio or service description"
        />

        <Button onClick={saveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default TradieProfilePage;
