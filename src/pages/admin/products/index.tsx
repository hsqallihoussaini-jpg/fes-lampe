import { useState } from 'react'
import MultiImageUploader from '../../../components/MultiImageUploader'
import VendorShell from '../../../components/VendorShell'

export default function AdminProducts() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imagesItems, setImagesItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const productCategories = [
    { value: 'lampes & luminaires', label: 'Lampes & luminaires' },
    { value: 'décoration', label: 'Décoration' },
    { value: 'bijoux & accessoires', label: 'Bijoux & accessoires' },
    { value: 'créations personnalisées', label: 'Créations personnalisées' },
    { value: 'pièces uniques', label: 'Pièces uniques' },
  ]

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
      title="Ajouter un produit"
      subtitle="Ajoutez une nouvelle création à votre catalogue."
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
      </div>
    </VendorShell>
  )
}
