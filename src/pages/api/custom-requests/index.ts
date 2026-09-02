import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const requests = await prisma.customRequest.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(requests)
  }

  if(req.method === 'POST'){
    const { name, email, details, dimensions, fileUrl } = req.body
    try{
      const r = await prisma.customRequest.create({ data: { name, email, details, dimensions, fileUrl } })
      return res.status(201).json(r)
    }catch(e){
      return res.status(500).json({ error: 'Création demande personnalisée échouée' })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
