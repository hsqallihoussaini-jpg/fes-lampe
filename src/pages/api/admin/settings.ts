import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'
import { defaultWhatsappNumber } from '../../../lib/catalog'

function isMissingTable(error: { code?: string; message?: string }) {
  return error.code === 'PGRST205' || error.message?.includes("Could not find the table")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getAdminTokenFromReq(req)
  if (!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' })

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('SiteSetting').select('*')
    if (error) {
      if (isMissingTable(error)) {
        return res.status(200).json({
          whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || defaultWhatsappNumber,
          setupRequired: true,
        })
      }
      return res.status(500).json({ error: error.message })
    }
    const settings = Object.fromEntries((data || []).map((item) => [item.key, item.value]))
    return res.status(200).json({ whatsappNumber: settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || defaultWhatsappNumber })
  }

  if (req.method === 'PUT') {
    const whatsappNumber = String(req.body?.whatsappNumber || '').replace(/[^\d]/g, '')
    if (!whatsappNumber || whatsappNumber.length < 8) return res.status(400).json({ error: 'Numéro WhatsApp invalide' })
    const { data, error } = await supabase.from('SiteSetting').upsert({ key: 'whatsappNumber', value: whatsappNumber }).select().single()
    if (error) {
      if (isMissingTable(error)) {
        return res.status(503).json({ error: 'La migration Supabase doit être exécutée avant d’enregistrer les paramètres.' })
      }
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ whatsappNumber: data.value })
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).end()
}
