import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const initializeProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profile centra resident")
          .select("id")
          .eq("id", user.id)
          .single()

        if (!existingProfile && !fetchError) {
          const storedRole = localStorage.getItem("signupRole") || "homeowner"

          const { error: insertError } = await supabase
            .from("profile centra resident")
            .insert({
              id: user.id,
              email: user.email,
              role: storedRole,
              status: "pending",
              created_at: new Date(),
            })

          if (!insertError) {
            console.log("✅ Profile created")
            localStorage.removeItem("signupRole")
          } else {
            console.error("❌ Failed to insert profile:", insertError.message)
          }
        } else {
          console.log("✅ Profile already exists — skipping insert")
        }
      }
    }

    initializeProfile()
  }, [])

  return null
}

export default ProfileInitializer
