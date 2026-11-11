import { useEffect, useState } from 'react'
import VendorShell from '../../components/VendorShell'

type CollectionImage = { id: string; url: string; position: number; visible: boolean; collectionKey?: string | null }

const collectionSlots = [
  { key: 'lumiere-contemporaine', label: 'Lumière contemporaine', accent: 'Design minimaliste' },
  { key: 'sculptures-du-foyer', label: 'Sculptures du foyer', accent: 'Pièces d’exception' },
  { key: 'decor-signature', label: 'Décor signature', accent: 'Ambiance haut de gamme' },
]

export default function AdminCollections() {
  const [images, setImages] = useState<CollectionImage[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const response = await fetch('/api/admin/collections')
    if (response.ok) setImages(await response.json())
  }

  useEffect(() => { load() }, [])

  async function upload(file: File, collectionKey: string) {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const uploadResponse = await fetch('/api/upload-supabase', { method: 'POST', body: formData })
    const uploadData = await uploadResponse.json()
    if (!uploadResponse.ok) { alert(uploadData.error || 'Upload échoué'); setLoading(false); return }
    const response = await fetch('/api/admin/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: uploadData.fileUrl, collectionKey, position: images.filter((image) => image.collectionKey === collectionKey).length }) })
    if (!response.ok) alert((await response.json()).error || 'Enregistrement échoué')
    await load()
    setLoading(false)
  }

  async function updateImage(image: CollectionImage, changes: Partial<CollectionImage>) {
    await fetch('/api/admin/collections', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: image.id, ...changes }) })
    await load()
  }

  async function removeImage(id: string) {
    if (!window.confirm('Supprimer cette image ?')) return
    await fetch(`/api/admin/collections?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    await load()
  }

  return (
    <VendorShell eyebrow="Maison Sqalli · Collections signées" title="Collections signées" subtitle="Gérez les visuels de la section d’accueil sans modifier le code." nav={[
      { href: '/seller', label: 'Dashboard' },
      { href: '/admin/products', label: 'Produits' },
      { href: '/admin/collections', label: 'Collections signées', active: true },
      { href: '/admin/settings', label: 'Paramètres' },
    ]}>
      <section className="vendor-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="vendor-panel-title">Images de la page d’accueil</h2><p className="vendor-panel-subtitle">Ajoutez, masquez, réordonnez ou remplacez les visuels.</p></div>
        </div>
        <div className="mt-8 space-y-8">
          {collectionSlots.map((slot) => (
            <section key={slot.key} className="vendor-list-item">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl text-[#f8efdf]">{slot.label}</h3>
                  <p className="mt-1 text-sm text-[#c7b197]">{slot.accent}</p>
                </div>
                <label className="vendor-button-secondary cursor-pointer">
                  Ajouter une photo
                  <input type="file" accept="image/*" className="hidden" disabled={loading} onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file, slot.key) }} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.filter((image) => image.collectionKey === slot.key).map((image) => (
                  <article key={image.id}>
                    <img src={image.url} alt={slot.label} className="aspect-square w-full rounded-xl object-cover" />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="vendor-button-secondary" onClick={() => updateImage(image, { position: Math.max(0, image.position - 1) })}>←</button>
                      <button type="button" className="vendor-button-secondary" onClick={() => updateImage(image, { position: image.position + 1 })}>→</button>
                      <button type="button" className="vendor-button-secondary" onClick={() => updateImage(image, { visible: !image.visible })}>{image.visible ? 'Masquer' : 'Afficher'}</button>
                      <button type="button" className="vendor-button-secondary" onClick={() => removeImage(image.id)}>Supprimer</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </VendorShell>
  )
}
