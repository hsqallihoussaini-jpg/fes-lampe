import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(products)
  }

  if(req.method === 'POST'){
    const { title, description, price, image, category, inStock } = req.body
    try{
      const p = await prisma.product.create({ data: { title, description, price: Number(price), image, category, inStock: Boolean(inStock) } })
      return res.status(201).json(p)
    }catch(e){
      return res.status(500).json({ error: 'Création produit échouée' })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
