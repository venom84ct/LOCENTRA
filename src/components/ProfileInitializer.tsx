import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      console.log("✅ Logged in user:", user.id)

      const { data: existingProfile, error: fetchError } = await supabase
        .from("profile_centra_resident") // ✅ updated table name
        .select("id")
        .eq("id", user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("❌ Error checking profile:", fetchError.message)
        return
      }

      if (!existingProfile) {
        const storedRole = localStorage.getItem("signupRole") || "homeowner"
        console.log("📝 Creating profile with role:", storedRole)

        const { error: insertError } = await supabase
          .from("profile_centra_resident") // ✅ updated table name
          .insert({
            id: user.id,
            email: user.email,
            role: storedRole,
            status: "pending",
            created_at: new Date(),
          })

        if (insertError) {
          console.error("❌ Error inserting profile:", insertError.message)
        } else {
          console.log("✅ Profile successfully inserted")
          localStorage.removeItem("signupRole")
        }
      }
    }

    initialize()
  }, [])

  return null
}

export default ProfileInitializer

