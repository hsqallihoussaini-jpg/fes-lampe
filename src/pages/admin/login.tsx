import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin(){
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e:any){
    e.preventDefault()
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if(res.ok) router.push('/admin')
    else setError('Mot de passe incorrect')
  }

  return (
    <div className="vendor-page flex items-center justify-center px-4 py-10">
      <div className="vendor-shell w-full max-w-4xl">
        <div className="vendor-card grid gap-0 overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative p-8 md:p-10">
            <div className="vendor-soft-glow" aria-hidden="true" />
            <p className="vendor-eyebrow">Maison Sqalli</p>
            <h1 className="vendor-title mt-4">Connexion vendeur</h1>
            <p className="vendor-subtitle">
              Accédez à l’interface professionnelle de gestion du catalogue, des commandes et des demandes personnalisées.
            </p>

            <div className="mt-8 space-y-3 text-sm leading-relaxed text-[#ccb89b]">
              <div className="vendor-chip">Accès protégé</div>
              <p>Ce panneau est réservé aux vendeurs autorisés du site. Le mot de passe est vérifié côté serveur.</p>
            </div>
          </div>

          <div className="border-t border-[#d6b07a]/12 bg-[rgba(10,9,8,0.74)] p-8 md:p-10 lg:border-l lg:border-t-0">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#d3ad77]">Mot de passe</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Entrez le mot de passe vendeur" className="vendor-input" />
              </div>
              <button className="vendor-button-primary w-full">Se connecter</button>
              {error && <div className="vendor-empty border-red-400/30 text-red-200">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
