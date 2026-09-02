export default function Footer(){
  return (
    <footer className="mt-16 bg-[#111111] text-[#f3ebdf]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-2xl font-serif">Maison Sqalli</div>
            <p className="mt-4 max-w-sm text-sm text-[#d3c6b8]">
              Créations artisanales marocaines en bronze, cuivre et matériaux nobles, pour des intérieurs empreints d’élégance.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.18em] text-[#d7b787]">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#e9dfd4]">
              <li>Accueil</li>
              <li>Boutique</li>
              <li>Création personnalisée</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.18em] text-[#d7b787]">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#e9dfd4]">
              <li>Fès, Maroc</li>
              <li>WhatsApp</li>
              <li>contact@maisonsqalli.ma</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2a261f] pt-6 text-center text-sm text-[#d3c6b8]">
          © {new Date().getFullYear()} Maison Sqalli — Créations artisanales de luxe
        </div>
      </div>
    </footer>
  )
}
