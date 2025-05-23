import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user

          const { data: existingProfile, error: fetchError } = await supabase
            .from("profile centra resident")
            .select("id")
            .eq("id", user.id)
            .single()

          if (!existingProfile && !fetchError) {
            const storedRole = localStorage.getItem("signupRole") || "homeowner"

            await supabase.from("profile centra resident").insert({
              id: user.id,
              email: user.email,
              role: storedRole,
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
