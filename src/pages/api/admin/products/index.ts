import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getAdminTokenFromReq(req)
  if(!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const supabase = getSupabaseServerClient()
  if (!supabase) return res.status(500).json({ error: 'Supabase non configuré' })

  if(req.method === 'GET'){
    const { data, error } = await supabase.from('Product').select('*').order('createdAt', { ascending: false })
    if (error) return res.status(500).json({ error: 'Lecture des produits échouée' })
    return res.status(200).json(data || [])
  }

  if(req.method === 'POST'){
    const { title, description, price, image, images, category, inStock, dimensions } = req.body
    const { data, error } = await supabase.from('Product').insert({
      title, description, price: Number(price), image,
      images: images ? JSON.stringify(images) : null,
      category, inStock: Boolean(inStock), dimensions,
    }).select().single()
    if (error) return res.status(500).json({ error: 'Création produit échouée' })
    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
