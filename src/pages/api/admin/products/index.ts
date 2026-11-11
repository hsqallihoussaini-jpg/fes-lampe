import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'
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
    const allowedCategories = [
      'lampes & luminaires',
      'décoration',
      'bijoux & accessoires',
      'créations personnalisées',
      'pièces uniques',
    ]
    const product = {
      id: randomUUID(),
      title: String(title || '').trim(),
      description: description ? String(description) : null,
      price: Number(price),
      image: image ? String(image) : null,
      images: Array.isArray(images) && images.length > 0 ? JSON.stringify(images) : null,
      category: category ? String(category).trim().toLowerCase() : null,
      inStock: inStock === undefined ? true : Boolean(inStock),
      dimensions: dimensions ? String(dimensions) : null,
      createdAt: new Date().toISOString(),
    }

    if (!product.title || !Number.isFinite(product.price) || product.price <= 0) {
      return res.status(400).json({ error: 'Nom et prix valides requis' })
    }

    if (!product.category || !allowedCategories.includes(product.category)) {
      return res.status(400).json({ error: 'Catégorie invalide' })
    }

    const { data, error } = await supabase.from('Product').insert(product).select().single()
    if (error) {
      console.error('Supabase product insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      return res.status(500).json({
        error: `Création produit échouée: ${error.message}`,
      })
    }
    return res.status(201).json(data)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
