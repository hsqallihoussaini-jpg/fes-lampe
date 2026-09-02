import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { prisma } from '../../../lib/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET || '')

async function getRawBody(req: NextApiRequest) {
  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = []
    req.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const sig = req.headers['stripe-signature'] as string | undefined
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if(!webhookSecret) return res.status(500).send('Stripe webhook secret not configured')

  let event: Stripe.Event
  try{
    const buf = await getRawBody(req)
    if(!sig) return res.status(400).send('Missing signature')
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  }catch(err:any){
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch(event.type){
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      try{
        // retrieve session with line items
        const full = await stripe.checkout.sessions.retrieve(session.id as string, { expand: ['line_items'] })
        const line_items = (full as any).line_items
        const amount_total = (full as any).amount_total || 0

        // store order in DB
        await prisma.order.create({ data: {
          total: Math.round(Number(amount_total) / 100),
          items: JSON.stringify(line_items ? line_items.data : []),
        }})
      }catch(e){
        console.error('Error saving order from webhook', e)
      }
      break
    default:
      // other event types — no action for now
      break
  }

  res.json({ received: true })
}
