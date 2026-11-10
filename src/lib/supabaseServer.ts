import { createClient } from '@supabase/supabase-js'

export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) {
    console.error('Supabase server credentials are missing')
    return null
  }

  return createClient(url, key)
}
