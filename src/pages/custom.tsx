import Link from 'next/link'
import { useState } from 'react'
import VendorShell from '../components/VendorShell'

export default function Custom(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(e:any){
    e.preventDefault()
    let fileUrl = ''

    if(file){
      const fd = new FormData()
      fd.append('file', file)
      const up = await fetch('/api/upload-supabase', { method: 'POST', body: fd })
      if(!up.ok){ alert('Échec de l\'upload'); return }
      const j = await up.json()
      fileUrl = j.fileUrl
    }

    const res = await fetch('/api/custom-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, details, dimensions, fileUrl }),
    })

    if(!res.ok){ alert('Erreur lors de l\'enregistrement'); return }

    const text = `Demande personnalisée de ${name}%0AEmail: ${email}%0ADimensions: ${dimensions}%0ADétails: ${details}%0ALien fichier: ${fileUrl}`
    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212XXXXXXXXX'
    window.location.href = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`
  }

  return (
    <VendorShell
      eyebrow="Maison Sqalli · Création personnalisée"
      title="Imaginez votre pièce sur mesure"
      subtitle="Décrivez votre besoin, ajoutez une inspiration et laissez l’atelier transformer votre idée en une pièce artisanale élégante, pensée pour votre espace."
      stats={[
        { label: 'Réponse', value: 'Rapide', detail: 'Retour envoyé via WhatsApp après réception.' },
        { label: 'Personnalisation', value: 'Totale', detail: 'Dimensions, matières et style ajustables.' },
        { label: 'Fichier', value: 'Optionnel', detail: 'Ajoutez une image de référence si nécessaire.' },
      ]}
      nav={[
        { href: '/', label: 'Accueil' },
        { href: '/shop', label: 'Boutique' },
        { href: '/custom', label: 'Sur mesure', active: true },
      ]}
      actions={[
        { href: '/shop', label: 'Retour boutique', variant: 'secondary' },
      ]}
    >
      <section className="vendor-grid-2">
        <aside className="vendor-panel overflow-hidden">
          <div className="h-56 overflow-hidden rounded-[1.1rem] border border-[#d6b07a]/14 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, rgba(17,17,17,0.16), rgba(17,17,17,0.7)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80')" }} />

          <div className="mt-5">
            <div className="vendor-panel-header">
              <div>
                <h2 className="vendor-panel-title">Comment ça fonctionne</h2>
                <p className="vendor-panel-subtitle">Un parcours simple, discret et centré sur votre besoin.</p>
              </div>
              <span className="vendor-chip">Atelier</span>
            </div>

            <div className="vendor-list">
              <div className="vendor-list-item">
                <div className="vendor-stat-label">Étape 1</div>
                <div className="mt-2 text-lg text-[#f8efdf]">Décrivez votre projet</div>
                <div className="mt-1 text-sm leading-relaxed text-[#c7b197]">Partagez les dimensions, le style souhaité et toutes les précisions utiles.</div>
              </div>
              <div className="vendor-list-item">
                <div className="vendor-stat-label">Étape 2</div>
                <div className="mt-2 text-lg text-[#f8efdf]">Ajoutez une inspiration</div>
                <div className="mt-1 text-sm leading-relaxed text-[#c7b197]">Une photo de référence aide à cadrer le rendu attendu avec finesse.</div>
              </div>
              <div className="vendor-list-item">
                <div className="vendor-stat-label">Étape 3</div>
                <div className="mt-2 text-lg text-[#f8efdf]">Recevez une réponse</div>
                <div className="mt-1 text-sm leading-relaxed text-[#c7b197]">Votre demande est transmise puis reprise via WhatsApp pour validation.</div>
              </div>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="vendor-panel">
          <div className="vendor-panel-header">
            <div>
              <h2 className="vendor-panel-title">Formulaire sur mesure</h2>
              <p className="vendor-panel-subtitle">Remplissez les champs ci-dessous pour lancer votre demande personnalisée.</p>
            </div>
            <span className="vendor-chip">Sur mesure</span>
          </div>

          <div className="vendor-form-grid vendor-form-grid--cols">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Nom</span>
              <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom" className="vendor-input" />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Email</span>
              <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Votre email" className="vendor-input" />
            </label>
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Dimensions souhaitées</span>
              <input value={dimensions} onChange={e=>setDimensions(e.target.value)} placeholder="Ex. 30 x 30 x 50 cm" className="vendor-input" />
            </label>
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Détails du projet</span>
              <textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Décrivez votre vision, le style recherché, la matière souhaitée et le lieu d'installation..." rows={7} className="vendor-textarea" />
            </label>
          </div>

          <div className="mt-5 vendor-uploader">
            <label className="block cursor-pointer">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Pièce de référence ou inspiration</span>
              <input type="file" onChange={e=>setFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-[#d9ccc0] file:mr-4 file:rounded-full file:border-0 file:bg-[#d7b787] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#171412]" />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button className="vendor-button-primary">Envoyer la demande</button>
            <Link href="/shop" className="vendor-button-secondary">Retour à la boutique</Link>
            <p className="text-xs text-[#c9b8a4]">Réponse rapide par WhatsApp</p>
          </div>
        </form>
      </section>
    </VendorShell>
  )
}
