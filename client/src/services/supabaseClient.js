import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Whether the app is actually configured to talk to Supabase.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing env vars — running in OFFLINE mode. ' +
      'Create client/.env.local with VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY (see .env.example) to enable auth & data.'
  )
}

// Fall back to harmless placeholder values so createClient() does not throw
// (which would blank the whole app) before the keys are configured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
