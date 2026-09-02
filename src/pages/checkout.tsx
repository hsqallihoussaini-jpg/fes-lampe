import { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

export default function Checkout(){
  const { items, clear } = useContext(CartContext)
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const [loading, setLoading] = useState(false)

  async function handlePay(){
    setLoading(true)
    try{
      const res = await fetch('/api/checkout/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
      if(!res.ok){ setLoading(false); alert('Erreur lors de la création de la session'); return }
      const { sessionId, url } = await res.json()

      if(url){
        window.location.href = url
        return
      }

      alert(sessionId ? 'Session Stripe créée sans URL de redirection.' : 'Erreur Stripe')
    }catch(e:any){
      console.error(e)
      alert('Erreur paiement')
    }finally{ setLoading(false) }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl mb-6">Checkout</h1>
      <p className="mb-4">Total à payer: <strong>{total} MAD</strong></p>
      <div className="flex gap-3">
        <button onClick={handlePay} disabled={loading || items.length===0} className="btn-primary">{loading ? 'Redirection…' : 'Payer maintenant'}</button>
        <button onClick={() => clear()} className="btn-outline">Vider le panier</button>
      </div>
    </div>
  )
}
