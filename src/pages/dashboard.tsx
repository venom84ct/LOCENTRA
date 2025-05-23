import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return setLoading(false)

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        console.warn("⚠️ No profile found or error occurred:", error)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile?.role === "tradie") {
      navigate("/dashboard/tradie")
    } else if (profile?.role === "homeowner") {
      navigate("/dashboard/homeowner")
    }
  }, [profile, navigate])

  if (loading || !profile?.role) return <p className="p-4">Setting up your profile...</p>

  return (
    <>
      <ProfileInitializer />
      <p>Redirecting based on your role...</p>
    </>
  )
}

export default Dashboard
