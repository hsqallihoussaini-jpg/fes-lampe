import { useContext, useState } from 'react'
import { CartContext } from '../context/CartContext'

export default function Checkout(){
  const { items, clear } = useContext(CartContext)
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const [loading, setLoading] = useState(false)

  async function handleWhatsApp(){
    setLoading(true)
    try{
      const response = await fetch('/api/whatsapp')
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Impossible de récupérer le numéro WhatsApp.')
      }

      const { whatsappNumber } = await response.json()
      const lines = items.map((item) => `- ${item.title} x${item.quantity} : ${item.price * item.quantity} MAD`)
      const message = [
        'Bonjour, je souhaite négocier le prix de ma commande.',
        '',
        'Produits :',
        ...lines,
        '',
        `Total indicatif : ${total} MAD`,
        `Lien : ${window.location.origin}/shop`,
        '',
        'Merci de me confirmer le prix et la disponibilité.',
      ].join('\n')

      clear()
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    }catch(e){
      console.error(e)
      alert(e instanceof Error ? e.message : 'Erreur lors de la redirection vers WhatsApp.')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl mb-6">Checkout</h1>
      <p className="mb-4">Total indicatif: <strong>{total} MAD</strong></p>
      <p className="mb-4 text-sm text-gray-600">Validez votre panier pour négocier directement avec nous sur WhatsApp.</p>
      <div className="flex gap-3">
        <button onClick={handleWhatsApp} disabled={loading || items.length===0} className="btn-primary">{loading ? 'Redirection…' : 'Valider et négocier sur WhatsApp'}</button>
        <button onClick={() => clear()} className="btn-outline">Vider le panier</button>
      </div>
    </div>
  )
}
