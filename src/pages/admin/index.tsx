import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../lib/adminAuth'
import VendorShell from '../../components/VendorShell'
import { getSupabaseServerClient } from '../../lib/supabaseServer'

export default function AdminIndex({ stats }:{ stats:any }){
  return (
    <VendorShell
      eyebrow="Maison Sqalli · Console vendeur"
      title="Portail professionnel"
      subtitle="Un point d’entrée premium pour orchestrer le catalogue, les commandes et les demandes sur mesure avec une lecture immédiate des priorités métier."
      stats={stats}
      nav={[
        { href: '/seller', label: 'Dashboard', active: true },
        { href: '/admin/products', label: 'Catalogue' },
        { href: '/admin/collections', label: 'Collections signées' },
        { href: '/admin/settings', label: 'Paramètres' },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/requests', label: 'Demandes' },
      ]}
      actions={[
        { href: '/seller', label: 'Ouvrir le dashboard', variant: 'primary' },
        { href: '/admin/products', label: 'Gérer le catalogue', variant: 'secondary' },
      ]}
    >
      <section className="vendor-panel">
        <div className="vendor-panel-header">
          <div>
            <h2 className="vendor-panel-title">Accès direct aux outils</h2>
            <p className="vendor-panel-subtitle">Tout ce qu’un vendeur doit ouvrir rapidement depuis un seul espace.</p>
          </div>
          <span className="vendor-chip">Professionnel</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link href="/seller" className="vendor-list-item block">
            <div className="vendor-stat-label">Vue générale</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Dashboard vendeur</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Voir les chiffres et les dernières activités.</div>
          </Link>

          <Link href="/admin/products" className="vendor-list-item block">
            <div className="vendor-stat-label">Catalogue</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Produits</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Ajouter, éditer et illustrer les pièces.</div>
          </Link>

          <Link href="/admin/orders" className="vendor-list-item block">
            <div className="vendor-stat-label">Flux commercial</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Commandes</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Suivre les ventes et le traitement.</div>
          </Link>

          <Link href="/admin/requests" className="vendor-list-item block">
            <div className="vendor-stat-label">Sur mesure</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Demandes</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Gérer les projets personnalisés.</div>
          </Link>

          <Link href="/admin/collections" className="vendor-list-item block">
            <div className="vendor-stat-label">Accueil</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Collections signées</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Gérer les images visibles sur la page d’accueil.</div>
          </Link>

          <Link href="/admin/settings" className="vendor-list-item block">
            <div className="vendor-stat-label">Configuration</div>
            <div className="mt-3 text-2xl text-[#f8efdf]">Paramètres</div>
            <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Configurer le numéro WhatsApp vendeur.</div>
          </Link>
        </div>
      </section>
    </VendorShell>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext){
  const token = getAdminTokenFromReq(ctx.req as any)
  if(!token || !verifyAdminToken(token)){
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  const supabase = getSupabaseServerClient()
  if (!supabase) return { props: { stats: [] } }

  const [productsResult, ordersResult, requestsResult] = await Promise.all([
    supabase.from('Product').select('category'),
    supabase.from('Order').select('id'),
    supabase.from('CustomRequest').select('id'),
  ])
  if (productsResult.error || ordersResult.error || requestsResult.error) {
    console.error('Admin dashboard query failed:', productsResult.error?.message || ordersResult.error?.message || requestsResult.error?.message)
    return { props: { stats: [] } }
  }

  const products = productsResult.data || []
  const orders = ordersResult.data || []
  const requests = requestsResult.data || []

  const categories = new Set(products.map((item) => item.category).filter(Boolean))

  return {
    props: {
      stats: [
        { label: 'Produits', value: String(products.length), detail: 'Éléments actuellement dans le catalogue.' },
        { label: 'Commandes', value: String(orders.length), detail: 'Transactions visibles dans le back-office.' },
        { label: 'Demandes', value: String(requests.length), detail: 'Formulaires sur mesure reçus.' },
        { label: 'Collections', value: String(categories.size), detail: 'Sections actives de la boutique.' },
      ],
    },
  }
}
