import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user

          // Check if the profile already exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from("profile centra resident")
            .select("id")
            .eq("id", user.id)
            .single()

          // If no profile exists, insert default profile
          if (!existingProfile && !fetchError) {
            await supabase.from("profile centra resident").insert({
              id: user.id,
              email: user.email,
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

  return null // This component doesn't render anything visible
}

export default ProfileInitializer

