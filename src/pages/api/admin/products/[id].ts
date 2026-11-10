import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getAdminTokenFromReq(req)
  if(!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' })
  const { id } = req.query

  if(req.method === 'PUT'){
    const { title, description, price, image, images, category, inStock, dimensions } = req.body
    const { data, error } = await supabase.from('Product').update({
      title, description, price: Number(price), image,
      images: images ? JSON.stringify(images) : null,
      category, inStock: Boolean(inStock), dimensions,
    }).eq('id', String(id)).select().single()
    if (error) return res.status(500).json({ error: 'Mise à jour échouée' })
    return res.status(200).json(data)
  }

  if(req.method === 'DELETE'){
    const { error } = await supabase.from('Product').delete().eq('id', String(id))
    if (error) return res.status(500).json({ error: 'Suppression échouée' })
    return res.status(204).end()
  }

  if(req.method === 'GET'){
    const { data, error } = await supabase.from('Product').select('*').eq('id', String(id)).maybeSingle()
    if (error) return res.status(500).json({ error: 'Lecture du produit échouée' })
    if(!data) return res.status(404).json({ error: 'Produit non trouvé' })
    return res.status(200).json(data)
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
