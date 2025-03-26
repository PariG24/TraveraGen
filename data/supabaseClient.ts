import { createClient } from '@supabase/supabase-js'

// Ensure that the environment variables are defined, and handle missing values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing. Please check your environment variables.')
}

// Create the Supabase client with the URL and API key
export const supabase = createClient(supabaseUrl, supabaseKey)
