import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../../lib/adminAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getAdminTokenFromReq(req)
  if(!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })
  const { id } = req.query

  if(req.method === 'PUT'){
    const { title, description, price, image, images, category, inStock, dimensions } = req.body
    try{
      const p = await prisma.product.update({ where: { id: String(id) }, data: { title, description, price: Number(price), image, images: images ? JSON.stringify(images) : undefined, category, inStock: Boolean(inStock), dimensions } })
      return res.status(200).json(p)
    }catch(e){ return res.status(500).json({ error: 'Mise à jour échouée' }) }
  }

  if(req.method === 'DELETE'){
    try{ await prisma.product.delete({ where: { id: String(id) } }); return res.status(204).end() }
    catch(e){ return res.status(500).json({ error: 'Suppression échouée' }) }
  }

  if(req.method === 'GET'){
    const p = await prisma.product.findUnique({ where: { id: String(id) } })
    if(!p) return res.status(404).json({ error: 'Produit non trouvé' })
    return res.status(200).json(p)
  }

  res.setHeader('Allow', ['GET','PUT','DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
