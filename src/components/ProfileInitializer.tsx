import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth event:", event)

        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user
          console.log("👤 Logged in user ID:", user.id)

          const { data: existingProfile, error: fetchError } = await supabase
            .from("profile centra resident")
            .select("id")
            .eq("id", user.id)
            .single()

          if (fetchError) {
            console.error("❌ Error fetching profile:", fetchError.message)
          }

          if (!existingProfile) {
            const storedRole = localStorage.getItem("signupRole") || "homeowner"
            console.log("📝 Stored role:", storedRole)

            const { error: insertError } = await supabase
              .from("profile centra resident")
              .insert({
                id: user.id,
                email: user.email,
                role: storedRole, // or hardcode 'homeowner' for testing
                status: "pending",
                created_at: new Date(),
              })

            if (insertError) {
              console.error("❌ Failed to insert profile:", insertError.message)
            } else {
              console.log("✅ Profile created")
              localStorage.removeItem("signupRole")
            }
          } else {
            console.log("✅ Profile already exists — skipping insert")
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
