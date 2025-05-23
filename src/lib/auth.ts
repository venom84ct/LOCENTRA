import { supabase } from "./supabaseClient"

// 🔐 Sign up a new user
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// 🔐 Sign in an existing user
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// 🔐 Sign out the current user
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return error
}

// 👤 Get the currently logged-in user
export function getUser() {
  return supabase.auth.getUser()
}
