import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"

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

        if (error) {
          console.error("❌ Error fetching profile:", error.message)
        } else {
          setProfile(data)
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

  if (loading) return <p className="p-4">Loading your dashboard...</p>
  if (!profile) return <p className="p-4 text-red-500">No profile found. Please refresh or sign up again.</p>
  if (!profile.role) return <p className="p-4">Setting up your profile... Please wait.</p>

  return null
}

export default Dashboard
