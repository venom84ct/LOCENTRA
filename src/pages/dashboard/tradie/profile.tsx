import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import JobHistoryAndReviews from "@/components/JobHistoryAndReviews"

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    abn: "",
    license: "",
    business_name: "",
    business_website: "",
    avatar_url: "",
    status: "pending",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from("profile-centra-resident")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else {
          setProfile(data)
          setFormData(data)
        }
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("profile centra resident")
      .update(formData)
      .eq("id", user.id)

    if (error) {
      console.error("Error saving profile:", error)
    } else {
      alert("Profile updated!")
      setEditing(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file)

    if (uploadError) {
      alert("Avatar upload failed.")
      return
    }

    const { error: updateError } = await supabase
      .from("profile centra resident")
      .update({ avatar_url: filePath })
      .eq("id", profile.id)

    if (updateError) {
      alert("Failed to update avatar URL.")
    } else {
      setFormData({ ...formData, avatar_url: filePath })
      setProfile({ ...profile, avatar_url: filePath })
      alert("Avatar updated!")
    }
  }

  if (loading) return <div>Loading profile...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tradie Profile</h1>

      {profile.avatar_url && (
        <div className="mb-4">
          <img
            src={`https://nlgiukcwbexfxkzdvzzq.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url.split("/").pop()}`}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-1">Change Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleAvatarUpload} />
      </div>

      {editing ? (
        <div className="space-y-4">
          {[
            ["first_name", "First Name"],
            ["last_name", "Last Name"],
            ["phone", "Phone"],
            ["abn", "ABN"],
            ["license", "License"],
            ["business_name", "Business Name"],
            ["business_website", "Business Website"]
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block font-medium">{label}</label>
              <input
                className="w-full border p-2"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>ABN:</strong> {profile.abn}</p>
          <p><strong>License:</strong> {profile.license}</p>
          <p><strong>Business:</strong> {profile.business_name}</p>
          <p><strong>Website:</strong> <a className="text-blue-600 underline" href={profile.business_website} target="_blank" rel="noreferrer">{profile.business_website}</a></p>
          <p>
            <strong>Status:</strong> <span className={`inline-block px-2 py-1 rounded text-white text-xs ${
              profile.status === "approved"
                ? "bg-green-500"
                : profile.status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}>
              {profile.status}
            </span>
          </p>
          <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </div>
      )}

      <JobHistoryAndReviews />
    </div>
  )
}
