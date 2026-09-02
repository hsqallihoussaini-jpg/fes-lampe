import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET || '')

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try{
    const { items } = req.body
    if(!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' })

    const line_items = items.map((it: any) => ({
      price_data: {
        currency: 'mad',
        product_data: { name: it.title },
        unit_amount: Math.round(Number(it.price) * 100),
      },
      quantity: Number(it.quantity) || 1,
    }))

    const origin = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return res.status(200).json({ sessionId: session.id, url: session.url })
  }catch(e:any){
    console.error('Stripe error', e)
    return res.status(500).json({ error: 'Stripe session creation failed' })
  }
}
