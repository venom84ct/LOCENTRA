import { createClient } from '@supabase/supabase-js'

// ✅ These will come from your environment variables (Vercel or .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ❗ If either variable is missing, show a warning in the console
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing!')
  console.log('VITE_SUPABASE_URL:', supabaseUrl)
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey)
}

// ✅ Create and export your Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
