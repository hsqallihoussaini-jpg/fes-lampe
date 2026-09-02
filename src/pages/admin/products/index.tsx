import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { prisma } from '../../../lib/prisma'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import { useState } from 'react'
import MultiImageUploader from '../../../components/MultiImageUploader'
import VendorShell from '../../../components/VendorShell'

export default function AdminProducts({ products }:{ products:any[] }){
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesItems, setImagesItems] = useState<any[]>([])

  async function create(){
    if(!title || price<=0){ alert('Titre requis et prix > 0'); return }
    // prepare images URLs: upload files and collect urls in order
    let imagesArr: string[] = []
    for(const it of imagesItems){
      if(it.url) imagesArr.push(it.url)
      else if(it.file){
        const fd = new FormData()
        fd.append('file', it.file)
        const up = await fetch('/api/upload-supabase', { method: 'POST', body: fd })
        if(!up.ok){ alert('Échec upload image'); return }
        const j = await up.json()
        imagesArr.push(j.fileUrl)
      }
    }

    await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, price, image: imagesArr[0], images: imagesArr, category, dimensions }) })
    window.location.reload()
  }

  return (
    <VendorShell
      eyebrow="Maison Sqalli · Catalogue"
      title="Produits & photographies"
      subtitle="Construisez un catalogue raffiné avec plusieurs images, des catégories lisibles et des fiches de produit plus élégantes."
      stats={[
        { label: 'Produits', value: String(products.length), detail: 'Fiches actuellement publiées.' },
        { label: 'Prix moyen', value: `${Math.round(products.reduce((sum, item) => sum + Number(item.price || 0), 0) / Math.max(products.length, 1))} MAD`, detail: 'Lecture rapide du niveau de gamme.' },
        { label: 'Collections', value: String(new Set(products.map((product) => product.category).filter(Boolean)).size), detail: 'Catégories actives.' },
      ]}
      nav={[
        { href: '/seller', label: 'Dashboard' },
        { href: '/admin/products', label: 'Catalogue', active: true },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/requests', label: 'Demandes' },
      ]}
      actions={[
        { href: '/seller', label: 'Retour vendeur', variant: 'secondary' },
        { href: '/admin/orders', label: 'Voir les commandes', variant: 'primary' },
      ]}
    >
      <section className="vendor-panel">
        <div className="vendor-panel-header">
          <div>
            <h2 className="vendor-panel-title">Créer un produit</h2>
            <p className="vendor-panel-subtitle">Remplissez les champs, ajoutez plusieurs photos puis enregistrez votre pièce.</p>
          </div>
          <span className="vendor-chip">Édition</span>
        </div>

        <div className="vendor-form-grid vendor-form-grid--cols">
          <input placeholder="Titre" value={title} onChange={e=>setTitle(e.target.value)} className="vendor-input" />
          <input placeholder="Prix" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} className="vendor-input" />
          <input placeholder="Catégorie" value={category} onChange={e=>setCategory(e.target.value)} className="vendor-input" />
          <input placeholder="Dimensions (ex: 30x30x50)" value={dimensions} onChange={e=>setDimensions(e.target.value)} className="vendor-input" />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <MultiImageUploader initial={[]} onChange={(items)=>{ setImagesItems(items); const first = items.find((i:any)=>i.url||i.file); if(first){ if(first.url) setImagePreview(first.url) } }} />

          <div className="vendor-list-item flex flex-col justify-between gap-4">
            <div>
              <div className="vendor-stat-label">Aperçu</div>
              <div className="mt-3 text-2xl text-[#f8efdf]">Image principale</div>
              <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">La première image chargée sera utilisée comme visuel principal dans la boutique.</div>
            </div>
            <div className="min-h-[180px] overflow-hidden rounded-[1rem] border border-[#d6b07a]/15 bg-black/30">
              {imagePreview ? <img src={imagePreview} className="h-[180px] w-full object-cover" alt="preview" /> : <div className="flex h-[180px] items-center justify-center text-sm text-[#c7b197]">Aucun aperçu pour le moment</div>}
            </div>
            <button onClick={create} className="vendor-button-primary w-full">Créer le produit</button>
          </div>
        </div>
      </section>

      <section className="vendor-panel">
        <div className="vendor-panel-header">
          <div>
            <h2 className="vendor-panel-title">Catalogue actuel</h2>
            <p className="vendor-panel-subtitle">Produits classés avec une lecture rapide des images et des actions.</p>
          </div>
          <span className="vendor-chip">{products.length} articles</span>
        </div>

        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Visuel</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="text-[#f8efdf]">{p.title}</div>
                    <div className="vendor-table-muted">{p.dimensions || 'Dimensions non renseignées'}</div>
                  </td>
                  <td className="vendor-table-muted">{p.category || 'Collection'}</td>
                  <td>{p.price} MAD</td>
                  <td>
                    {p.image ? <img src={p.image} className="h-14 w-14 rounded-[0.85rem] object-cover" alt={p.title} /> : <span className="vendor-table-muted">Aucune image</span>}
                  </td>
                  <td>
                    <div className="vendor-inline-actions">
                      <Link href={`/admin/products/${p.id}`} className="vendor-button-secondary">Modifier</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </VendorShell>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext){
  const token = getAdminTokenFromReq(ctx.req as any)
  if(!token || !verifyAdminToken(token)) return { redirect: { destination: '/admin/login', permanent: false } }
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return { props: { products: JSON.parse(JSON.stringify(products)) } }
}

