import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"

const CallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        console.error("Failed to get session:", error)
        navigate("/login")
        return
      }

      const user = session.user

      const { data: profile, error: profileError } = await supabase
        .from("profile_centra_resident")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError || !profile) {
        console.error("Profile fetch failed:", profileError)
        navigate("/login")
        return
      }

      const role = profile.role
      localStorage.setItem("userType", role)
      localStorage.setItem("isLoggedIn", "true")

      if (role === "tradie") {
        navigate("/dashboard/tradie")
      } else {
        navigate("/dashboard/homeowner")
      }
    }

    handleRedirect()
  }, [navigate])

  return <div className="text-center mt-10 text-lg">Redirecting based on your role...</div>
}

export default CallbackPage
