import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(orders)
  }

  if(req.method === 'POST'){
    const { total, items } = req.body
    try{
      const order = await prisma.order.create({ data: { total: Number(total), items: JSON.stringify(items) } })
      return res.status(201).json(order)
    }catch(e){
      return res.status(500).json({ error: 'Création commande échouée' })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
