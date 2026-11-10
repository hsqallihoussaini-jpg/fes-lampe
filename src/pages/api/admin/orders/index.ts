import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getAdminTokenFromReq(req)
  if(!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' })

  if(req.method === 'GET'){
    const { data, error } = await supabase.from('Order').select('*').order('createdAt', { ascending: false })
    if (error) return res.status(500).json({ error: 'Lecture des commandes échouée' })
    return res.status(200).json(data || [])
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
