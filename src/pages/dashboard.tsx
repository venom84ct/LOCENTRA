import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import ProfileInitializer from "@/components/ProfileInitializer"

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from("profile centra resident")
          .select("*")
          .eq("id", user.id)
          .single()

        if (!error) {
          setProfile(data)
        } else {
          console.error("Failed to fetch profile:", error.message)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile?.role) {
      if (profile.role === "tradie") {
        navigate("/dashboard/tradie")
      } else {
        navigate("/dashboard/homeowner")
      }
    }
  }, [profile, navigate])

  if (loading || !profile) return <p className="p-4">Loading profile...</p>
  if (!profile.role) return <p className="p-4">Setting up your account. Please wait...</p>

  return (
    <>
      <ProfileInitializer />
      <p>Redirecting...</p>
    </>
  )
}

export default Dashboard
