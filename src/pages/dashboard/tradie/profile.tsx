import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Trash2 } from "lucide-react";

interface TradieProfile {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  abn: string | null;
  license: string | null;
  bio: string | null;
  avatar_url: string | null;
  portfolio: string[] | null;
  review_avg: number | null;
  review_count: number | null;
}

export default function TradieProfilePage() {
  const session = useSession();
  const user = session?.user;
  const [profile, setProfile] = useState<TradieProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPortfolioItem, setNewPortfolioItem] = useState("");

  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
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
        portfolio: profile.portfolio,
        avatar_url: profile.avatar_url,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setProfile(data);
      alert("Profile updated.");
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const filePath = `${user.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("tradie-avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("tradie-avatars")
      .getPublicUrl(filePath);

    const avatar_url = urlData.publicUrl;

    setProfile((prev) => prev ? { ...prev, avatar_url } : prev);
  };

  const addPortfolioItem = () => {
    if (!newPortfolioItem.trim()) return;
    setProfile((prev) =>
      prev ? { ...prev, portfolio: [...(prev.portfolio || []), newPortfolioItem] } : prev
    );
    setNewPortfolioItem("");
  };

  const removePortfolioItem = (item: string) => {
    setProfile((prev) =>
      prev
        ? { ...prev, portfolio: (prev.portfolio || []).filter((p) => p !== item) }
        : prev
    );
  };

  if (loading) return <DashboardLayout><div className="p-4">Loading...</div></DashboardLayout>;
  if (!profile) return <DashboardLayout><div className="p-4">Profile not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Tradie Profile</h1>

        {/* Avatar Upload */}
        <div>
          <label className="block mb-2">Profile Picture</label>
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-24 w-24 rounded-full mb-2 object-cover border"
            />
          )}
          <Input type="file" accept="image/*" onChange={uploadAvatar} />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>First Name</label>
            <Input
              value={profile.first_name || ""}
              onChange={(e) => handleChange("first_name", e.target.value)}
            />
          </div>
          <div>
            <label>Last Name</label>
            <Input
              value={profile.last_name || ""}
              onChange={(e) => handleChange("last_name", e.target.value)}
            />
          </div>
          <div>
            <label>ABN</label>
            <Input
              value={profile.abn || ""}
              onChange={(e) => handleChange("abn", e.target.value)}
            />
          </div>
          <div>
            <label>License</label>
            <Input
              value={profile.license || ""}
              onChange={(e) => handleChange("license", e.target.value)}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label>Bio</label>
          <Input
            value={profile.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>

        {/* Portfolio Items */}
        <div>
          <label>Portfolio</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newPortfolioItem}
              onChange={(e) => setNewPortfolioItem(e.target.value)}
              placeholder="e.g. Kitchen renovation"
            />
            <Button onClick={addPortfolioItem}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile.portfolio || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center px-3 py-1 rounded-full bg-gray-100 border"
              >
                {item}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => removePortfolioItem(item)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="text-gray-600">
          <p>
            ⭐ Average Rating:{" "}
            <strong>{profile.review_avg?.toFixed(1) ?? "N/A"}</strong>
          </p>
          <p>📝 Reviews Count: <strong>{profile.review_count ?? 0}</strong></p>
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </DashboardLayout>
  );
}
