import { createClient } from '@supabase/supabase-js'

function getServerSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://pgwzdlwhdwawbezssjsw.supabase.co'
  const key =
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error(
      'Supabase server credentials are missing. Expected SUPABASE_URL and SUPABASE_SERVICE_KEY.'
    )
    return null
  }

  try {
    new URL(url)
  } catch {
    console.error('Supabase server URL is invalid')
    return null
  }

  return { url, key }
}

export function getSupabaseServerClient() {
  const config = getServerSupabaseConfig()
  if (!config) return null

  return createClient(config.url, config.key)
}
