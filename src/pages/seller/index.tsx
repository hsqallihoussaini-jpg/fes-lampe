import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'
import { prisma } from '../../lib/prisma'
import { getAdminTokenFromReq, verifyAdminToken } from '../../lib/adminAuth'
import VendorShell from '../../components/VendorShell'

export default function SellerIndex({ stats, recentProducts, recentOrders, recentRequests }:{ stats:any, recentProducts:any[], recentOrders:any[], recentRequests:any[] }){
  return (
    <VendorShell
      eyebrow="Maison Sqalli · Espace vendeur"
      title="Pilotage boutique & créations"
      subtitle="Un centre de commande premium pour gérer le catalogue, les commandes et les demandes sur mesure dans une interface plus claire, plus sobre et plus luxueuse."
      stats={stats}
      nav={[
        { href: '/seller', label: 'Dashboard', active: true },
        { href: '/admin/products', label: 'Catalogue' },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/requests', label: 'Demandes' },
      ]}
      actions={[
        { href: '/admin/products', label: 'Nouveau produit', variant: 'primary' },
        { href: '/admin/orders', label: 'Voir les commandes', variant: 'secondary' },
      ]}
    >
      <div className="vendor-grid-2">
        <section className="vendor-panel">
          <div className="vendor-panel-header">
            <div>
              <h2 className="vendor-panel-title">Raccourcis professionnels</h2>
              <p className="vendor-panel-subtitle">Accédez rapidement aux zones les plus utilisées sans quitter l’identité visuelle de la marque.</p>
            </div>
            <span className="vendor-chip">Temps réel</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/admin/products" className="vendor-list-item block">
              <div className="vendor-stat-label">Catalogue</div>
              <div className="mt-3 text-2xl text-[#f8efdf]">Produits & photos</div>
              <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Ajouter, organiser et enrichir les fiches produits avec plusieurs images.</div>
            </Link>

            <Link href="/admin/orders" className="vendor-list-item block">
              <div className="vendor-stat-label">Suivi</div>
              <div className="mt-3 text-2xl text-[#f8efdf]">Commandes</div>
              <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Consulter les ventes, suivre les totaux et vérifier les détails des achats.</div>
            </Link>

            <Link href="/admin/requests" className="vendor-list-item block sm:col-span-2">
              <div className="vendor-stat-label">Sur mesure</div>
              <div className="mt-3 text-2xl text-[#f8efdf]">Demandes personnalisées</div>
              <div className="mt-2 text-sm leading-relaxed text-[#c7b197]">Retrouver les demandes clients et les pièces à fabriquer sur commande.</div>
            </Link>
          </div>

          <div className="vendor-divider my-6" />

          <div className="vendor-panel-header mb-3">
            <div>
              <h3 className="vendor-panel-title text-[1.2rem]">Derniers produits</h3>
              <p className="vendor-panel-subtitle">Aperçu rapide du catalogue le plus récent.</p>
            </div>
            <span className="vendor-chip">{recentProducts.length} visibles</span>
          </div>

          <div className="vendor-list">
            {recentProducts.length ? recentProducts.map((product) => (
              <div key={product.id} className="vendor-list-item flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-lg text-[#f8efdf]">{product.title}</div>
                  <div className="mt-1 text-sm text-[#c7b197]">{product.category || 'Collection'} · {product.price} MAD</div>
                </div>
                <Link href={`/admin/products/${product.id}`} className="vendor-button-secondary shrink-0">Modifier</Link>
              </div>
            )) : <div className="vendor-empty">Aucun produit n’est encore enregistré.</div>}
          </div>
        </section>

        <div className="space-y-6">
          <section className="vendor-panel">
            <div className="vendor-panel-header">
              <div>
                <h2 className="vendor-panel-title">Commandes récentes</h2>
                <p className="vendor-panel-subtitle">Les derniers achats pour piloter le suivi commercial.</p>
              </div>
              <span className="vendor-chip">{recentOrders.length} entrées</span>
            </div>

            <div className="vendor-list">
              {recentOrders.length ? recentOrders.map((order) => (
                <div key={order.id} className="vendor-list-item flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[#f8efdf]">Total {order.total} MAD</div>
                    <div className="mt-1 text-sm text-[#c7b197]">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <span className="vendor-chip">#{String(order.id).slice(-6)}</span>
                </div>
              )) : <div className="vendor-empty">Aucune commande pour le moment.</div>}
            </div>
          </section>

          <section className="vendor-panel">
            <div className="vendor-panel-header">
              <div>
                <h2 className="vendor-panel-title">Demandes sur mesure</h2>
                <p className="vendor-panel-subtitle">Les demandes clientes à traiter avec soin.</p>
              </div>
              <span className="vendor-chip">{recentRequests.length} visibles</span>
            </div>

            <div className="vendor-list">
              {recentRequests.length ? recentRequests.map((request) => (
                <div key={request.id} className="vendor-list-item">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[#f8efdf]">{request.name}</div>
                      <div className="mt-1 text-sm text-[#c7b197]">{request.email}</div>
                    </div>
                    <span className="vendor-chip">{request.dimensions || 'Sur mesure'}</span>
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-[#d9c6ab]">{request.details}</div>
                </div>
              )) : <div className="vendor-empty">Aucune demande enregistrée.</div>}
            </div>
          </section>
        </div>
      </div>
    </VendorShell>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext){
  const token = getAdminTokenFromReq(ctx.req as any)
  if(!token || !verifyAdminToken(token)){
    return { redirect: { destination: '/admin/login', permanent: false } }
  }
  const [products, orders, requests] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, price: true, category: true, createdAt: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, total: true, createdAt: true } }),
    prisma.customRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, dimensions: true, details: true } }),
  ])

  const categories = new Set(products.map((product) => product.category).filter(Boolean))

  return {
    props: {
      stats: [
        { label: 'Produits', value: String(products.length), detail: 'Fiches visibles dans la boutique.' },
        { label: 'Commandes', value: String(orders.length), detail: 'Derniers achats reçus.' },
        { label: 'Demandes', value: String(requests.length), detail: 'Projets sur mesure à traiter.' },
        { label: 'Collections', value: String(categories.size), detail: 'Catégories actives dans le catalogue.' },
      ],
      recentProducts: JSON.parse(JSON.stringify(products)),
      recentOrders: JSON.parse(JSON.stringify(orders)),
      recentRequests: JSON.parse(JSON.stringify(requests)),
    },
  }
}
