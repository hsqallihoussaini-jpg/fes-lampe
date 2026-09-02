import { GetServerSidePropsContext } from 'next'
import { prisma } from '../../../lib/prisma'
import { getAdminTokenFromReq, verifyAdminToken } from '../../../lib/adminAuth'
import VendorShell from '../../../components/VendorShell'

export default function AdminRequests({ requests }:{ requests:any[] }){
  return (
    <VendorShell
      eyebrow="Maison Sqalli · Sur mesure"
      title="Demandes personnalisées"
      subtitle="Retrouvez les briefs clients dans une interface luxueuse et lisible, conçue pour prioriser les projets à fabriquer."
      stats={[
        { label: 'Demandes', value: String(requests.length), detail: 'Briefs reçus et prêts à traiter.' },
      ]}
      nav={[
        { href: '/seller', label: 'Dashboard' },
        { href: '/admin/products', label: 'Catalogue' },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/requests', label: 'Demandes', active: true },
      ]}
      actions={[
        { href: '/admin/products', label: 'Retour catalogue', variant: 'secondary' },
      ]}
    >
      <section className="vendor-panel">
        <div className="vendor-panel-header">
          <div>
            <h2 className="vendor-panel-title">Briefs reçus</h2>
            <p className="vendor-panel-subtitle">Un tableau plus raffiné pour lire les coordonnées, les dimensions et les fichiers joints.</p>
          </div>
          <span className="vendor-chip">{requests.length} entrées</span>
        </div>

        <div className="vendor-table-wrap">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Dimensions</th>
                <th>Message</th>
                <th>Fichier</th>
              </tr>
            </thead>
            <tbody>
              {requests.length ? requests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="text-[#f8efdf]">{r.name}</div>
                    <div className="vendor-table-muted">{r.email}</div>
                  </td>
                  <td>{r.dimensions || '—'}</td>
                  <td className="vendor-table-muted">{r.details}</td>
                  <td>
                    {r.fileUrl ? <a target="_blank" rel="noreferrer" href={r.fileUrl} className="vendor-link">Voir fichier</a> : <span className="vendor-table-muted">Aucun</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4}><div className="vendor-empty">Aucune demande personnalisée pour le moment.</div></td></tr>
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
  const requests = await prisma.customRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return { props: { requests: JSON.parse(JSON.stringify(requests)) } }
}
