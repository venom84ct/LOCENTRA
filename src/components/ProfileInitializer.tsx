import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user

          // Check if profile already exists
          const { data: profile, error } = await supabase
            .from("profile_centra_resident")
            .select("id")
            .eq("id", user.id)
            .single()

          // If not, insert it as homeowner
          if (!profile && !error) {
            await supabase.from("profile_centra_resident").insert({
              id: user.id,
              email: user.email,
              role: "homeowner",
              status: "pending",
              created_at: new Date(),
            })
          }
        }
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return null
}

export default ProfileInitializer
