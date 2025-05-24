import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import ProfileInitializer from "@/components/ProfileInitializer"

const DashboardRedirect = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return setLoading(false)

      const { data, error } = await supabase
        .from("profile_centra_resident")
        .select("role")
        .eq("id", user.id)
        .single()

      if (data?.role) {
        navigate(`/dashboard/${data.role}`)
      } else {
        console.warn("⚠️ No role found or error occurred:", error)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [navigate])

  return (
    <>
      <ProfileInitializer />
      <p className="p-4">Redirecting based on your role...</p>
    </>
  )
}

export default DashboardRedirect
