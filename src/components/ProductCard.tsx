import Link from 'next/link'

export default function ProductCard({ product }:{ product:any }){
  const parseImages = () => {
    if (!product.images) return []
    try {
      const parsed = JSON.parse(product.images)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const imgs = parseImages()
  const main = imgs.length ? imgs[0] : product.image
  const category = product.category || 'Collection'
  const initials = product.title
    .split(' ')
    .slice(0, 2)
    .map((part:string) => part[0]).join('')
    .toUpperCase()

  return (
    <article className="product-card group overflow-hidden rounded-[1.5rem] border border-[#d6b07a]/16 bg-[rgba(18,16,14,0.72)] shadow-[0_18px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d3ad77]/35 hover:shadow-[0_24px_45px_rgba(0,0,0,0.26)]">
      <Link href={`/product/${product.id}`} className="block">
        {main ? (
          <div className="relative overflow-hidden">
            <img src={main} alt={product.title} className="h-[20rem] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b]/60 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="flex h-[20rem] w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(214,176,122,0.28),transparent_18%),linear-gradient(135deg,#1e1a17,#8a5a2d_45%,#171412)] text-4xl font-semibold text-[#f8efdf]">
            {initials || 'FL'}
          </div>
        )}

        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-[#d9b888]/30 bg-[rgba(183,124,69,0.08)] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#f1d9b2]">
              {category}
            </span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#c7b197]">{product.inStock === false ? 'Indisponible' : 'En stock'}</span>
          </div>

          <h3 className="text-[1.6rem] leading-[1.15] text-[#f8efdf]">{product.title}</h3>

          <div className="mt-5 flex items-end justify-between border-t border-[#d6b07a]/14 pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#d3ad77]">Prix</div>
              <div className="mt-2 text-[1.55rem] font-semibold leading-none text-[#f1d9b2]">{product.price} MAD</div>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b07a]/25 bg-[rgba(183,124,69,0.1)] text-xl text-[#f8efdf] transition group-hover:border-[#d3ad77]/45 group-hover:bg-[rgba(183,124,69,0.22)]">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
