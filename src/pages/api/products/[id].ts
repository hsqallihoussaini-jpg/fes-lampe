import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  if(req.method === 'GET'){
    const supabase = getSupabaseServerClient()
    const { data: product } = supabase
      ? await supabase.from('Product').select('*').eq('id', String(id)).maybeSingle()
      : { data: null }
    if(!product) return res.status(404).json({ error: 'Produit non trouvé' })
    return res.status(200).json(product)
  }

  if(req.method === 'PUT'){
    const { title, description, price, image, category, inStock } = req.body
    try{
      const p = await prisma.product.update({ where: { id: String(id) }, data: { title, description, price: Number(price), image, category, inStock: Boolean(inStock) } })
      return res.status(200).json(p)
    }catch(e){
      return res.status(500).json({ error: 'Mise à jour échouée' })
    }
  }

  if(req.method === 'DELETE'){
    try{
      await prisma.product.delete({ where: { id: String(id) } })
      return res.status(204).end()
    }catch(e){
      return res.status(500).json({ error: 'Suppression échouée' })
    }
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
