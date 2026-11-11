import { useEffect, useState } from 'react'
import VendorShell from '../../components/VendorShell'

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then((response) => response.json()).then((data) => setWhatsappNumber(data.whatsappNumber || ''))
  }, [])

  async function save() {
    const response = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ whatsappNumber }) })
    const data = await response.json()
    setMessage(response.ok ? 'Paramètres enregistrés.' : (data.error || 'Enregistrement échoué.'))
  }

  return (
    <VendorShell eyebrow="Maison Sqalli · Paramètres" title="Paramètres de la boutique" subtitle="Configurez les informations utilisées par le storefront et les demandes clients." nav={[
      { href: '/seller', label: 'Dashboard' },
      { href: '/admin/products', label: 'Produits' },
      { href: '/admin/collections', label: 'Collections signées' },
      { href: '/admin/settings', label: 'Paramètres', active: true },
    ]}>
      <section className="vendor-panel max-w-3xl">
        <h2 className="vendor-panel-title">WhatsApp vendeur</h2>
        <p className="vendor-panel-subtitle">Utilisez le format international sans le signe + ni espaces.</p>
        <input value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} className="vendor-input mt-6" placeholder="212600000000" />
        <button type="button" onClick={save} className="vendor-button-primary mt-5">Enregistrer</button>
        {message ? <p className="mt-4 text-sm text-[#d3ad77]">{message}</p> : null}
      </section>
    </VendorShell>
  )
}
