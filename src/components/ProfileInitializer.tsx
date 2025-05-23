import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user

          // 🔍 1. Check if profile already exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from("profile_centra_resident")
            .select("id")
            .eq("id", user.id)
            .single()

          // 🔄 2. If not, insert profile row
          if (!existingProfile && !fetchError) {
            const storedRole = localStorage.getItem("signupRole") || "homeowner"

            const { error: insertError } = await supabase
              .from("profile_centra_resident")
              .insert({
                id: user.id, // 🔑 Required for RLS
                email: user.email,
                role: storedRole,
                status: "pending",
                created_at: new Date(),
              })

            if (insertError) {
              console.error("Profile insert failed:", insertError.message)
            }
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
