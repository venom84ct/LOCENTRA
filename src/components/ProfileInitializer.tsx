import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const insertIfMissing = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.warn("🚫 No user found or auth error:", authError?.message)
        return
      }

      console.log("✅ Logged in user:", user.id, user.email)

      const { data: profile, error: fetchError } = await supabase
        .from("profile centra resident")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (fetchError) {
        console.error("❌ Error checking profile:", fetchError.message)
        return
      }

      if (profile) {
        console.log("✅ Profile already exists — skipping insert")
        return
      }

      const storedRole = localStorage.getItem("signupRole") || "homeowner"

      console.log("📝 Creating profile with role:", storedRole)

      const { error: insertError } = await supabase
        .from("profile centra resident")
        .insert({
          id: user.id,
          email: user.email,
          role: storedRole,
          status: "pending",
          created_at: new Date(),
        })

      if (insertError) {
        console.error("❌ Failed to insert profile:", insertError.message)
      } else {
        console.log("✅ Profile successfully inserted")
        localStorage.removeItem("signupRole")
      }
    }

    insertIfMissing()
  }, [])

  return null
}

export default ProfileInitializer
