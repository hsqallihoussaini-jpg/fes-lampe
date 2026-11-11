import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getAdminTokenFromReq(req)
  if (!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' })

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('SignedCollectionImage').select('*').order('position', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    const { url, position, visible } = req.body || {}
    if (!url) return res.status(400).json({ error: 'URL image requise' })
    const { data, error } = await supabase.from('SignedCollectionImage').insert({
      id: randomUUID(),
      url: String(url),
      position: Number.isFinite(Number(position)) ? Number(position) : 0,
      visible: visible !== false,
    }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    const { id, url, position, visible } = req.body || {}
    const { data, error } = await supabase.from('SignedCollectionImage').update({
      ...(url ? { url: String(url) } : {}),
      ...(position !== undefined ? { position: Number(position) } : {}),
      ...(visible !== undefined ? { visible: Boolean(visible) } : {}),
    }).eq('id', String(id)).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('SignedCollectionImage').delete().eq('id', String(req.query.id))
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
  return res.status(405).end()
}
