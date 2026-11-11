import { GetServerSidePropsContext } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'
import { useState } from 'react'
import Modal from '../../../components/Modal'
import MultiImageUploader from '../../../components/MultiImageUploader'
import VendorShell from '../../../components/VendorShell'
import { pricingModes, productCategories, stockStatuses } from '../../../lib/catalog'

export default function EditProduct({ product }:{ product:any }){
  const [title, setTitle] = useState(product?.title||'')
  const [price, setPrice] = useState(product?.price||0)
  const [category, setCategory] = useState(product?.category||'')
  const [dimensions, setDimensions] = useState(product?.dimensions||'')
  const [description, setDescription] = useState(product?.description||'')
  const [stockStatus, setStockStatus] = useState(product?.stockStatus || (product?.inStock === false ? 'OUT_OF_STOCK' : 'IN_STOCK'))
  const [pricingMode, setPricingMode] = useState(product?.pricingMode || 'FIXED')
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const existingImages = product?.images ? JSON.parse(product.images) : []
  const [imagesItems, setImagesItems] = useState<any[]>(existingImages.map((u:string,i:number)=>({ id: String(i), url: u })))

  async function save(){
    if(!title || price<=0){ alert('Titre requis et prix > 0'); return }
    // assemble images array: upload new files and preserve existing urls in order
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
    const mainImage = imagesArr[0] || product?.image
    const response = await fetch(`/api/admin/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, price, image: mainImage, images: imagesArr, category, dimensions, stockStatus, pricingMode }) })
    if (!response.ok) { const result = await response.json().catch(() => null); alert(result?.error || 'Mise à jour échouée'); return }
    window.location.href = '/admin/products'
  }

  async function removeConfirmed(){
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
    window.location.href = '/admin/products'
  }

  return (
    <VendorShell
      eyebrow="Maison Sqalli · Édition produit"
      title="Modifier le produit"
      subtitle="Ajustez le titre, la catégorie, les dimensions et la galerie d’images dans un cadre plus élégant et plus professionnel."
      nav={[
        { href: '/seller', label: 'Dashboard' },
        { href: '/admin/products', label: 'Catalogue', active: true },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/requests', label: 'Demandes' },
      ]}
      actions={[
        { href: '/admin/products', label: 'Retour catalogue', variant: 'secondary' },
      ]}
    >
      <section className="vendor-grid-2">
        <div className="vendor-panel">
          <div className="vendor-panel-header">
            <div>
              <h2 className="vendor-panel-title">Fiche produit</h2>
              <p className="vendor-panel-subtitle">Modifiez les champs et conservez la hiérarchie visuelle du catalogue.</p>
            </div>
            <span className="vendor-chip">Édition en cours</span>
          </div>

          <div className="vendor-form-grid vendor-form-grid--cols">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre" className="vendor-input" />
            <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} placeholder="Prix" className="vendor-input" />
            <input value={dimensions} onChange={e=>setDimensions(e.target.value)} placeholder="Dimensions" className="vendor-input" />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="vendor-input min-h-28" />
            <select value={category} onChange={e=>setCategory(e.target.value)} className="vendor-input">
              {productCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select value={stockStatus} onChange={e=>setStockStatus(e.target.value)} className="vendor-input">
              {stockStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select value={pricingMode} onChange={e=>setPricingMode(e.target.value)} className="vendor-input">
              {pricingModes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>

          <div className="mt-5">
            <MultiImageUploader initial={existingImages} onChange={(items)=>{ setImagesItems(items); const first = items.find((i:any)=>i.url||i.file); if(first && first.url){ setImagePreview(first.url) } }} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={save} className="vendor-button-primary">Enregistrer</button>
            <button onClick={()=>setConfirmOpen(true)} className="vendor-button-secondary">Supprimer</button>
          </div>
        </div>

        <aside className="vendor-panel">
          <div className="vendor-panel-header">
            <div>
              <h2 className="vendor-panel-title">Aperçu et sécurité</h2>
              <p className="vendor-panel-subtitle">La première image de la liste reste la couverture principale du produit.</p>
            </div>
          </div>

          <div className="vendor-list-item">
            <div className="vendor-stat-label">Aperçu de couverture</div>
            <div className="mt-3 overflow-hidden rounded-[1rem] border border-[#d6b07a]/15 bg-black/30">
              {imagePreview ? <img src={imagePreview} className="h-[250px] w-full object-cover" alt={product?.title || 'preview'} /> : <div className="flex h-[250px] items-center justify-center text-sm text-[#c7b197]">Aucune image principale</div>}
            </div>
          </div>

          <div className="mt-5 vendor-list-item">
            <div className="vendor-stat-label">Publication</div>
            <div className="mt-3 text-sm leading-relaxed text-[#c7b197]">Utilisez un nom clair, une catégorie cohérente et une galerie propre pour conserver la cohérence de la marque.</div>
          </div>
        </aside>
      </section>

      <Modal open={confirmOpen} title="Confirmer la suppression" onClose={()=>setConfirmOpen(false)}>
        <p className="text-[#d9c6ab]">Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.</p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={()=>setConfirmOpen(false)} className="vendor-button-secondary">Annuler</button>
          <button onClick={removeConfirmed} className="vendor-button-primary">Supprimer</button>
        </div>
      </Modal>
    </VendorShell>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext){
  const token = getAdminTokenFromReq(ctx.req as any)
  if(!token || !verifyAdminToken(token)) return { redirect: { destination: '/admin/login', permanent: false } }
  const { id } = ctx.query
  const supabase = getSupabaseServerClient()
  if (!supabase) return { notFound: true }
  const { data: product, error } = await supabase.from('Product').select('*').eq('id', String(id)).maybeSingle()
  if (error) {
    console.error('Product query failed:', error.message)
    return { notFound: true }
  }
  if(!product) return { notFound: true }
  return { props: { product } }
}
