import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import Lightbox from '../../components/Lightbox'

export default function ProductPage(){
  const router = useRouter()
  const { id } = router.query
  const { addItem } = useContext(CartContext)

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    fetch(`/api/products/${id}`).then(r=>r.ok? r.json() : null).then(j=>{
      setProduct(j)
      setActiveIndex(0)
      setLoading(false)
    }).catch(()=>{ setLoading(false) })
  },[id])

  // autoplay: advance when not hovered
  useEffect(()=>{
    if(!product) return
    const images: string[] = product.images ? JSON.parse(product.images) : (product.image ? [product.image] : [])
    if(images.length <= 1) return
    if(isHovered) return
    if(!isPlaying) return
    const idt = setInterval(()=>{
      setActiveIndex(i => (i+1) % images.length)
    }, 3500)
    return ()=>clearInterval(idt)
  },[product, isHovered, isPlaying])

  if(!id || loading) return <div className="p-6">Chargement...</div>
  if(!product) return <div className="p-6">Produit introuvable</div>

  const images: string[] = product.images ? JSON.parse(product.images) : (product.image ? [product.image] : [])
  const main = images.length ? images[activeIndex] : '/placeholder.jpg'
  return (
    <>
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
            <img onClick={()=>{ setLightboxIndex(activeIndex); setLightboxOpen(true) }} src={main} alt={product.title} className="w-full rounded-md object-cover max-h-[560px] cursor-zoom-in" />
            <button onClick={()=>setActiveIndex((activeIndex-1+images.length)%images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded">◀</button>
            <button onClick={()=>setActiveIndex((activeIndex+1)%images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded">▶</button>
            <button onClick={()=>setIsPlaying(p=>!p)} aria-label="Play/Pause" className="absolute right-3 top-3 bg-white/80 p-2 rounded">
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            {images.map((u, idx)=> (
              <button key={idx} onClick={()=>{ setActiveIndex(idx); setLightboxIndex(idx); }} className={`border p-1 rounded ${idx===activeIndex? 'ring-2 ring-bronze':''}`}>
                <img onClick={(e)=>{ e.stopPropagation(); setLightboxIndex(idx); setLightboxOpen(true) }} src={u} className="h-20 w-20 object-cover cursor-zoom-in" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <p className="text-lg text-bronze font-bold mb-4">{product.price} MAD</p>
          <p className="mb-4">{product.description}</p>
          {product.dimensions && <p className="mb-4"><strong>Dimensions:</strong> {product.dimensions}</p>}
          <div className="flex gap-3">
            <button onClick={() => { addItem({ id: String(product.id), title: product.title, price: product.price, quantity: 1 }) }} className="btn-primary">Ajouter au panier</button>
            <button onClick={() => router.push('/checkout')} className="btn-outline">Acheter</button>
          </div>
        </div>
        </div>
      </div>
      {lightboxOpen && <Lightbox images={images} start={lightboxIndex} onClose={()=>setLightboxOpen(false)} />}
    </>
  )
}
