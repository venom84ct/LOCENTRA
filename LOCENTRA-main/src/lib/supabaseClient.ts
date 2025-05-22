import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For debugging — shows if your env variables are working
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase KEY:', supabaseAnonKey)
