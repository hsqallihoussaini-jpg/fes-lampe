import Link from 'next/link'
import { getSupabaseServerClient } from '../lib/supabaseServer'

const features = [
  { title: 'Bronze forgé', text: 'Matériaux nobles et finitions qui traversent les générations.' },
  { title: 'Sur mesure', text: 'Des volumes, formes et dimensions pensées pour votre intérieur.' },
  { title: 'Made in Fès', text: 'Un savoir-faire artisanal inspiré du patrimoine marocain.' },
]

const collections = [
  { name: 'Lumière contemporaine', accent: 'Design minimaliste' },
  { name: 'Sculptures du foyer', accent: 'Pièces d’exception' },
  { name: 'Décor signature', accent: 'Ambiance haut de gamme' },
]

export default function Home({ collectionImages = [] }:{ collectionImages?: string[] }){
  return (
    <div className="bg-[#0d0c0b]">
      <section className="hero-shell relative overflow-hidden">
        <div className="container mx-auto px-5 py-20 md:px-8 md:py-28 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="max-w-3xl text-[0.92rem] leading-[1.9] text-[#d7b37a] sm:text-[1.05rem] md:text-[1.25rem] lg:text-[1.45rem]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.08em' }}>
                L’artisanat marocain sublimé par une élégance contemporaine.
              </h1>
            </div>
          </div>
        </div>
        <div className="hero-orb" aria-hidden="true" />
      </section>

      <section className="container mx-auto px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card rounded-[1.75rem] p-7 md:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#d8b48b] bg-[#1b1816]">
                <span className="text-xl text-[#d7b07a]">✦</span>
              </div>
              <h3 className="mb-3 text-2xl md:text-[2rem] text-[#f2e1c6]">{feature.title}</h3>
              <p className="text-base leading-relaxed text-[#d7c8b1]">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 pb-20 md:px-8 md:pb-28 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div>
            <span className="stat-pill">Sélection maison</span>
            <h2 className="mt-4 text-4xl md:text-5xl text-[#e9d8b9]">Collections signées</h2>
          </div>
          <Link href="/shop" className="btn-outline">Voir toute la boutique</Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((collection, index) => (
            <div key={collection.name} className="collection-card flex min-h-[400px] flex-col justify-end bg-cover bg-center p-7" style={{ backgroundImage: collectionImages[index] ? `linear-gradient(180deg, rgba(17,17,17,0.08), rgba(17,17,17,0.76)), url(${collectionImages[index]})` : `linear-gradient(180deg, rgba(17,17,17,0.08), rgba(17,17,17,0.76)), linear-gradient(135deg, rgba(179,107,58,${0.34 + index * 0.12}), rgba(17,17,17,0.92))` }}>
              <p className="text-xs uppercase tracking-[0.22em] text-[#f1d8ae]">{collection.accent}</p>
              <h3 className="mt-3 text-3xl text-[#f9f1e9] md:text-4xl">{collection.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="story-panel py-20 text-[#f3ebdf] md:py-28">
        <div className="container mx-auto grid gap-10 px-5 md:grid-cols-2 md:gap-12 md:px-8 lg:px-10">
          <div className="flex flex-col justify-center">
            <span className="stat-pill bg-[#2a221d] border-[#8c6845] text-[#f0c98d]">Artisanat Fès</span>
            <h2 className="mt-6 max-w-xl text-4xl md:text-5xl text-[#e9d8b9]">Une lumière pensée pour les espaces qui méritent le détail.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#d4c1a0] md:text-lg">
              Chaque pièce est conçue pour allier fonctionnalité, héritage et élégance intérieure. Nous créons des lampes destinées à devenir des objets de mémoire, de présence et de prestige.
            </p>
            <div className="mt-10 flex gap-8 text-sm uppercase tracking-[0.14em] text-[#f0c98d]">
              <div>
                <div className="text-3xl text-[#f9f1e9]">12+</div>
                <div>années</div>
              </div>
              <div>
                <div className="text-3xl text-[#f9f1e9]">3.4k</div>
                <div>pièces</div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#d9b171]/20 bg-[#201d1b] p-7 min-h-[220px]">
              <div className="mb-6 h-12 w-12 rounded-full border border-[#d9b171]/30 bg-[#d9b171]/10" />
              <h3 className="mb-2 text-2xl text-[#f2e1c6]">Matériaux premium</h3>
              <p className="text-base leading-relaxed text-[#d5c4a7]">Bronze, cuivre et finitions élégantes sélectionnées avec soin.</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#d9b171]/20 bg-[#201d1b] p-7 min-h-[220px]">
              <div className="mb-6 h-12 w-12 rounded-full border border-[#d9b171]/30 bg-[#d9b171]/10" />
              <h3 className="mb-2 text-2xl text-[#f2e1c6]">Finition sur mesure</h3>
              <p className="text-base leading-relaxed text-[#d5c4a7]">Formes et dimensions adaptées à votre habitat, votre style et vos envies.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps() {
  const supabase = getSupabaseServerClient()
  if (!supabase) return { props: { collectionImages: [] } }
  const { data } = await supabase
    .from('SignedCollectionImage')
    .select('url')
    .eq('visible', true)
    .order('position', { ascending: true })
  return { props: { collectionImages: (data || []).map((item) => item.url) } }
}
