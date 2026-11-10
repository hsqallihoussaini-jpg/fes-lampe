import { GetServerSidePropsContext } from 'next'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import VendorShell from '../../../components/VendorShell'
import { getSupabaseServerClient } from '../../../lib/supabaseServer'

export default function AdminOrders({ orders }:{ orders:any[] }){
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  return (
    <VendorShell
      eyebrow="Maison Sqalli · Suivi des ventes"
      title="Commandes"
      subtitle="Consultez les ventes récentes dans une interface claire, sombre et haut de gamme, pensée pour la lecture rapide des totaux et des détails."
      stats={[
        { label: 'Commandes', value: String(orders.length), detail: 'Transactions reçues.' },
        { label: 'Chiffre', value: `${totalRevenue} MAD`, detail: 'Total cumulé des commandes visibles.' },
      ]}
      nav={[
        { href: '/seller', label: 'Dashboard' },
        { href: '/admin/products', label: 'Catalogue' },
        { href: '/admin/orders', label: 'Commandes', active: true },
        { href: '/admin/requests', label: 'Demandes' },
      ]}
      actions={[
        { href: '/admin/products', label: 'Retour catalogue', variant: 'secondary' },
      ]}
    >
      <section className="vendor-panel">
        <div className="vendor-panel-header">
          <div>
            <h2 className="vendor-panel-title">Historique des ventes</h2>
            <p className="vendor-panel-subtitle">Une lecture plus premium des commandes, avec le détail des contenus à la demande.</p>
          </div>
          <span className="vendor-chip">{orders.length} lignes</span>
        </div>

        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Total</th>
                <th>Date</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? orders.map(o => (
                <tr key={o.id}>
                  <td className="text-[#f8efdf]">#{String(o.id).slice(-8)}</td>
                  <td>{o.total} MAD</td>
                  <td className="vendor-table-muted">{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <details>
                      <summary className="cursor-pointer list-none text-[#d3ad77]">Voir le contenu</summary>
                      <pre className="mt-3 whitespace-pre-wrap rounded-[1rem] border border-[#d6b07a]/14 bg-black/30 p-4 text-sm text-[#e8d8be]">{o.items}</pre>
                    </details>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4}><div className="vendor-empty">Aucune commande pour le moment.</div></td></tr>
              )}
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
  const supabase = getSupabaseServerClient()
  if (!supabase) return { props: { orders: [] } }
  const { data: orders, error } = await supabase.from('Order').select('*').order('createdAt', { ascending: false })
  if (error) {
    console.error('Orders query failed:', error.message)
    return { props: { orders: [] } }
  }
  return { props: { orders: orders || [] } }
}
