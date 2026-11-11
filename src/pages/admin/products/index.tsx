import { useState } from 'react'
import type { GetServerSidePropsContext } from 'next'
import MultiImageUploader from '../../../components/MultiImageUploader'
import VendorShell from '../../../components/VendorShell'
import { pricingModes, productCategories, stockStatuses } from '../../../lib/catalog'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'

export default function AdminProducts({ products = [] }: { products?: any[] }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesItems, setImagesItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stockStatus, setStockStatus] = useState('IN_STOCK')
  const [pricingMode, setPricingMode] = useState('FIXED')

  async function create() {
    if (!title.trim()) {
      alert('Veuillez saisir le nom du produit.')
      return
    }

    if (!price || Number(price) <= 0) {
      alert('Veuillez saisir un prix valide.')
      return
    }

    if (!category) {
      alert('Veuillez sélectionner une catégorie.')
      return
    }

    if (imagesItems.length === 0) {
      alert('Veuillez ajouter au moins une image.')
      return
    }

    setLoading(true)

    try {
      const imagesArr: string[] = []

      // Upload de chaque image vers Supabase
      for (const it of imagesItems) {
        // Image déjà présente
        if (it.url) {
          imagesArr.push(it.url)
          continue
        }

        // Nouvelle image sélectionnée
        if (it.file) {
          const formData = new FormData()
          formData.append('file', it.file)

          const uploadResponse = await fetch('/api/upload-supabase', {
            method: 'POST',
            body: formData,
          })

          // Afficher l'erreur exacte du serveur
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => null)

            console.error('Erreur upload Supabase:', errorData)

            alert(
              errorData?.error ||
                `Échec de l’upload de l’image (${uploadResponse.status}).`
            )

            return
          }

          const uploadData = await uploadResponse.json()

          console.log('Upload Supabase réussi:', uploadData)

          if (!uploadData?.fileUrl) {
            console.error('Réponse upload invalide:', uploadData)

            alert(
              'L’image a été envoyée, mais aucune URL n’a été retournée par Supabase.'
            )

            return
          }

          imagesArr.push(uploadData.fileUrl)
        }
      }

      if (imagesArr.length === 0) {
        alert('Aucune image valide à enregistrer.')
        return
      }

      // Création du produit
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          price: Number(price),
          image: imagesArr[0],
          images: imagesArr,
          category: category.trim(),
          dimensions: dimensions.trim(),
          stockStatus,
          pricingMode,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        console.error('Erreur création produit:', result)

        alert(
          result?.error ||
            `Impossible de créer le produit (${response.status}).`
        )

        return
      }

      console.log('Produit créé:', result)

      alert('Produit créé avec succès.')

      // Réinitialiser le formulaire
      setTitle('')
      setPrice('')
      setCategory('')
      setDimensions('')
      setStockStatus('IN_STOCK')
      setPricingMode('FIXED')
      setImagesItems([])
      setImagePreview(null)
    } catch (error: any) {
      console.error('Erreur générale:', error)

      alert(
        error?.message ||
          'Une erreur est survenue pendant la création du produit.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <VendorShell
      eyebrow="Maison Sqalli · Catalogue"
      title="Ajouter un produit"
      subtitle="Ajoutez une nouvelle création à votre catalogue."
      nav={[
        { href: '/seller', label: 'Dashboard' },
        { href: '/admin/products', label: 'Produits', active: true },
        { href: '/admin/collections', label: 'Collections signées' },
        { href: '/admin/settings', label: 'Paramètres' },
      ]}
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-[#f8efdf]">
            Ajouter un produit
          </h1>

          <p className="mt-2 text-sm text-[#d0b89d]">
            Ajoutez une nouvelle création à votre catalogue.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">
                Nom du produit
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Suspension artisanale en cuivre"
                className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none transition focus:border-[#d3ad77]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">
                Prix
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex. 2500"
                className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none transition focus:border-[#d3ad77]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">
                Catégorie
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none transition focus:border-[#d3ad77]"
              >
                <option value="">Sélectionner une catégorie</option>
                {productCategories.map((productCategory) => (
                  <option key={productCategory.value} value={productCategory.value}>
                    {productCategory.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">Disponibilité</label>
              <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none focus:border-[#d3ad77]">
                {stockStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">Tarification</label>
              <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value)} className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none focus:border-[#d3ad77]">
                {pricingModes.map((mode) => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.18em] text-[#d3ad77]">
                Dimensions
              </label>

              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ex. 80 cm de diamètre"
                className="w-full rounded-lg border border-[#5d4937] bg-[#17130f] px-4 py-3 text-[#f8efdf] outline-none transition focus:border-[#d3ad77]"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <MultiImageUploader
              initial={[]}
              onChange={(items) => {
                setImagesItems(items)

                const first = items.find(
                  (item: any) => item.url || item.file
                )

                if (first?.url) {
                  setImagePreview(first.url)
                } else if (first?.file) {
                  setImagePreview(URL.createObjectURL(first.file))
                } else {
                  setImagePreview(null)
                }
              }}
            />

            {imagePreview && (
              <div className="mt-6 overflow-hidden rounded-xl border border-[#5d4937]">
                <img
                  src={imagePreview}
                  alt="Aperçu du produit"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bouton */}
        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={create}
            disabled={loading}
            className="rounded-lg border border-[#d3ad77] bg-[#d3ad77] px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#17130f] transition hover:bg-[#e2c18e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer le produit'}
          </button>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl text-[#f8efdf]">Produits publiés</h2>
              <p className="mt-1 text-sm text-[#c7b197]">{products.length} produit(s) dans le catalogue.</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="vendor-list-item">
                {product.image ? <img src={product.image} alt={product.title} className="mb-4 aspect-square w-full rounded-xl object-cover" /> : null}
                <h3 className="text-xl text-[#f8efdf]">{product.title}</h3>
                <p className="mt-2 text-sm text-[#c7b197]">{product.price} MAD · {product.category}</p>
                <div className="mt-4 flex gap-3">
                  <a href={`/admin/products/${product.id}`} className="vendor-button-secondary">Modifier</a>
                  <button type="button" onClick={async () => { if (!window.confirm('Supprimer ce produit ?')) return; const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' }); if (response.ok) window.location.reload(); else alert('Suppression échouée') }} className="vendor-button-secondary">Supprimer</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </VendorShell>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = getAdminTokenFromReq(ctx.req as any)
  if (!token || !verifyAdminToken(token)) return { redirect: { destination: '/admin/login', permanent: false } }
  const supabase = getSupabaseServerClient()
  if (!supabase) return { props: { products: [] } }
  const { data, error } = await supabase.from('Product').select('*').order('createdAt', { ascending: false })
  if (error) {
    console.error('Admin products query failed:', error.message)
    return { props: { products: [] } }
  }
  return { props: { products: data || [] } }
}
