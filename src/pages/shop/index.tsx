import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import { getSupabaseServerClient } from '../../lib/supabaseServer'

const categories = [
  {
    key: 'lampes & luminaires',
    label: 'Lampes & luminaires',
    description: 'Éclairage sculptural et trajectoire douce, pensé pour transformer chaque pièce en scène intime.',
    accent: 'Lumière enveloppante',
  },
  {
    key: 'décoration',
    label: 'Décoration',
    description: 'Objets de présence et textures méditerranéennes pour une maison élégante et respirante.',
    accent: 'Élégance quotidienne',
  },
  {
    key: 'bijoux & accessoires',
    label: 'Bijoux & accessoires',
    description: 'Des accents raffinés, portés avec une dose de finesse et de caractère artisanal.',
    accent: 'Détails précieux',
  },
  {
    key: 'créations personnalisées',
    label: 'Créations personnalisées',
    description: 'Une pièce pensée autour de votre espace, de votre lumière et de votre histoire.',
    accent: 'Sur mesure',
  },
  {
    key: 'pièces uniques',
    label: 'Pièces uniques',
    description: 'Créations rares et objets d’exception pour des intérieurs singuliers.',
    accent: 'Edition limitée',
  },
]

const categorySpacing: Record<string, { marginLeft?: string; marginRight?: string }> = {
  'lampes & luminaires': { marginRight: '2.8rem' },
  décoration: { marginRight: '4.5rem' },
  'bijoux & accessoires': { marginLeft: '1.2rem', marginRight: '3.2rem' },
  'créations personnalisées': { marginLeft: '1rem', marginRight: '2.4rem' },
  'pièces uniques': { marginLeft: '0.8rem' },
}

function getMainImage(product:any) {
  if (!product) return null

  if (product.image) return product.image

  if (product.images) {
    try {
      const parsed = JSON.parse(product.images)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
    } catch {
      return null
    }
  }

  return null
}

export default function Shop({ products }:{ products:any[] }){
  const byCategory = categories.map((category) => ({
    ...category,
    items: products.filter((product) => {
      const title = (product.category || '').toLowerCase()
      return title === category.key
    }),
  }))

  return (
    <div className="vendor-page">
      <div className="vendor-shell">
        <section className="vendor-card vendor-hero">
          <div className="vendor-soft-glow" aria-hidden="true" />

          <div className="vendor-hero-top">
            <div className="relative z-1">
              <p className="vendor-eyebrow">Maison Sqalli · Boutique</p>
              <h1 className="vendor-title">L’artisanat marocain sublimé par une élégance contemporaine.</h1>
              <p className="vendor-subtitle">
                Une boutique pensée comme une galerie d’objets rares, de luminaires sculpturaux et de pièces sur mesure.
              </p>
            </div>

            <div className="vendor-action-bar">
              <Link href="/custom" className="vendor-button-primary">Créer une pièce unique</Link>
              <Link href="#collections" className="vendor-button-secondary">Voir les collections</Link>
            </div>
          </div>

          <div className="vendor-stats-grid">
            <div className="vendor-stat">
              <div className="vendor-stat-label">Collections</div>
              <div className="vendor-stat-value">{byCategory.length}</div>
              <div className="vendor-stat-detail">Sections organisées pour une lecture immédiate.</div>
            </div>
            <div className="vendor-stat">
              <div className="vendor-stat-label">Pièces visibles</div>
              <div className="vendor-stat-value">{products.length}</div>
              <div className="vendor-stat-detail">Produits présentés avec une hiérarchie nette.</div>
            </div>
            <div className="vendor-stat">
              <div className="vendor-stat-label">Sur mesure</div>
              <div className="vendor-stat-value">Oui</div>
              <div className="vendor-stat-detail">Accès direct aux créations personnalisées.</div>
            </div>
          </div>
        </section>

        <section id="collections" className="vendor-panel mt-6">
          <div className="vendor-panel-header">
            <div>
              <h2 className="vendor-panel-title">Collections</h2>
              <p className="vendor-panel-subtitle">Naviguez entre les univers de la boutique avec une ligne horizontale claire et généreusement espacée.</p>
            </div>
            <span className="vendor-chip">Sélection</span>
          </div>

          <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="mx-auto flex min-w-max items-center justify-center gap-0 px-6">
              {byCategory.map((category) => {
                const href = category.key === 'créations personnalisées' ? '/custom' : `#${category.key.replace(/\s+/g, '-')}`
                const spacing = categorySpacing[category.key] || {}

                return (
                  <Link
                    key={category.key}
                    href={href}
                    style={{ marginLeft: spacing.marginLeft, marginRight: spacing.marginRight }}
                    className="vendor-nav-link whitespace-nowrap"
                  >
                    {category.label.toUpperCase()}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <div className="space-y-6 md:space-y-8">
        {byCategory.map((category) => {
          const sectionId = category.key.replace(/\s+/g, '-')

          return (
            <article
              id={sectionId}
              key={category.key}
              className="vendor-panel overflow-hidden"
            >
              <div className="vendor-hero">
                <div className="vendor-panel-header">
                  <div>
                    <p className="vendor-stat-label">{category.accent}</p>
                    <h2 className="vendor-panel-title mt-3 text-[2.2rem] md:text-[2.6rem]">{category.label}</h2>
                    <p className="vendor-panel-subtitle mt-3 max-w-2xl">
                      {category.description}
                    </p>
                  </div>

                  <div className="vendor-action-bar md:min-w-[16rem] md:justify-end">
                    <span className="vendor-chip">{category.items.length} pièces</span>

                    {category.key === 'créations personnalisées' ? (
                      <Link href="/custom" className="vendor-button-secondary">
                        Demander une création
                      </Link>
                    ) : (
                      <a href={`#${sectionId}`} className="vendor-button-secondary">
                        Voir la collection
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {category.items.length > 0 ? (
                <div className="product-grid gap-6 p-5 md:gap-8 md:p-7">
                  {category.items.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="vendor-empty m-5 md:m-7">
                  La collection arrive bientôt avec des créations exclusives signées Maison Sqalli.
                </div>
              )}
            </article>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    console.error('Shop catalog unavailable: Supabase server credentials are missing')
    return { props: { products: [] } }
  }

  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Shop catalog query failed:', error.message)
    return { props: { products: [] } }
  }

  return { props: { products: data || [] } }
}
