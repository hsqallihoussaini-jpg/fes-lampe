import Link from 'next/link'
import WhatsAppButton from './WhatsAppButton'

export default function Header(){
  return (
    <header className="sticky top-0 z-50 border-b border-[#2d2a27] bg-[#111111]/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 md:px-6 md:py-5">
        <div className="relative flex items-center justify-between gap-4 md:min-h-[64px]">
          <div className="w-[110px] md:w-[160px]" aria-hidden="true" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 text-center">
            <Link
              href="/"
              className="select-none whitespace-nowrap text-[1.05rem] font-medium tracking-[0.22em] text-transparent md:text-[1.45rem] lg:text-[1.75rem]"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                backgroundImage: 'linear-gradient(135deg, #f9e6c3 0%, #d9b57b 22%, #b77a3d 48%, #f2d8a5 68%, #d6a768 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                textShadow: '0 0 18px rgba(214,176,122,0.18)',
              }}
            >
              Maison Sqalli
            </Link>
            <span
              className="select-none whitespace-nowrap text-[0.52rem] uppercase tracking-[0.28em] text-[#d6b180] md:text-[0.62rem]"
              style={{
                fontFamily: 'Inter, "Segoe UI", sans-serif',
                letterSpacing: '0.28em',
                opacity: 0.9,
              }}
            >
              L’artisanat marocain d’exception
            </span>
          </div>

          <div className="ml-auto flex flex-col items-end gap-3 md:gap-4">
            <div className="flex items-center gap-5 md:gap-7">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7b787]/70 bg-[#171412]/80 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2d9aa] transition-all duration-300 hover:border-[#f0d8ae] hover:bg-[#1e1b18]"
              >
                <span aria-hidden="true" className="text-sm">🛒</span>
                Panier
              </Link>

              <WhatsAppButton />
            </div>

            <Link
              href="/custom"
              className="inline-flex items-center rounded-full border border-[#d7b787]/60 bg-transparent px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f0d8ae] transition-all duration-300 hover:border-[#f0d8ae] hover:bg-[#d7b787]/5"
            >
              Créer une pièce unique
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
