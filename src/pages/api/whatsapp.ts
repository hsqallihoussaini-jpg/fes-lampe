import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultWhatsappNumber } from '../../lib/catalog'
import { getSupabaseServerClient } from '../../lib/supabaseServer'

function isMissingTable(error: { code?: string; message?: string }) {
  return error.code === 'PGRST205' || error.message?.includes('Could not find the table')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const fallback = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || defaultWhatsappNumber
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(200).json({ whatsappNumber: fallback })

  const { data, error } = await supabase
    .from('SiteSetting')
    .select('value')
    .eq('key', 'whatsappNumber')
    .maybeSingle()

  if (error && !isMissingTable(error)) {
    console.error('WhatsApp setting lookup failed', error)
    return res.status(500).json({ error: 'Impossible de récupérer le numéro WhatsApp.' })
  }

  return res.status(200).json({
    whatsappNumber: data?.value || fallback,
  })
}
