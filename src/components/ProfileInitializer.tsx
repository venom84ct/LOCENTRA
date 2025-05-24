// src/components/ProfileInitializer.tsx
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const ProfileInitializer = () => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;
          const { data: existing, error } = await supabase
            .from("profile_centra_resident")
            .select("id")
            .eq("id", user.id)
            .single();

          if (!existing && !error) {
            const role = localStorage.getItem("signupRole") || "homeowner";
            await supabase.from("profile_centra_resident").insert({
              id: user.id,
              email: user.email,
              role,
              status: "pending",
              created_at: new Date().toISOString(),
            });
          }
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return null;
};

export default ProfileInitializer;

