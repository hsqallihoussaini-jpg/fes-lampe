import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import Link from 'next/link'

export default function CartPage(){
  const { items, removeItem, clear } = useContext(CartContext)
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl mb-6">Panier</h1>
      {items.length===0 ? (
        <div>Votre panier est vide. <Link href="/shop" className="text-bronze">Retour à la boutique</Link></div>
      ) : (
        <div>
          <ul className="space-y-4">
            {items.map(it => (
              <li key={it.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-600">{it.quantity} x {it.price} MAD</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => removeItem(it.id)} className="text-red-600">Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-lg font-semibold">Total: {total} MAD</div>
            <div className="flex gap-3">
              <button onClick={clear} className="px-4 py-2 border">Vider</button>
              <Link href="/checkout" className="btn-primary">Passer au paiement</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
