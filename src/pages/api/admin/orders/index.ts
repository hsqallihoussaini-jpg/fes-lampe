import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../../lib/adminAuth'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getAdminTokenFromReq(req)
  if(!token || !verifyAdminToken(token)) return res.status(401).json({ error: 'Unauthorized' })

  if(req.method === 'GET'){
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(orders)
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
