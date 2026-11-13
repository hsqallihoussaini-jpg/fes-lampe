import { useEffect, useState } from 'react'

export default function Lightbox({ images, start=0, onClose }:{ images: string[], start?: number, onClose: ()=>void }){
  const [index, setIndex] = useState(start)
  const [zoom, setZoom] = useState(1)

  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      if(e.key === 'Escape') onClose()
      if(e.key === 'ArrowRight') setIndex(i=> (i+1) % images.length)
      if(e.key === 'ArrowLeft') setIndex(i=> (i-1+images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[images.length, onClose])

  useEffect(()=> setIndex(start), [start])
  useEffect(()=> setZoom(1), [index])

  if(!images || images.length===0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative max-w-4xl w-full mx-4" onClick={e=>e.stopPropagation()}>
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <button onClick={()=>setZoom(z=>Math.max(1, z-0.25))} aria-label="Réduire le zoom" className="text-white bg-black/60 rounded px-2 py-1">−</button>
          <button onClick={()=>setZoom(1)} aria-label="Réinitialiser le zoom" className="text-white bg-black/60 rounded px-2 py-1">{Math.round(zoom * 100)}%</button>
          <button onClick={()=>setZoom(z=>Math.min(3, z+0.25))} aria-label="Agrandir l'image" className="text-white bg-black/60 rounded px-2 py-1">+</button>
          <button onClick={onClose} aria-label="Fermer l'image" className="text-white bg-black/60 rounded px-2 py-1">✕</button>
        </div>
        <button onClick={()=>setIndex(i=> (i-1+images.length)%images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded px-2 py-1">◀</button>
        <div className="flex h-[70vh] items-center justify-center overflow-auto">
          <img src={images[index]} alt={`Image ${index+1}`} style={{ transform: `scale(${zoom})` }} className="max-h-full max-w-full object-contain rounded transition-transform duration-200" />
        </div>
        <button onClick={()=>setIndex(i=> (i+1)%images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded px-2 py-1">▶</button>
        <div className="mt-2 text-center text-white">{index+1} / {images.length}</div>
      </div>
    </div>
  )
}
