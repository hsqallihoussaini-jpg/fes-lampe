import { useEffect, useState } from 'react'

export default function Lightbox({ images, start=0, onClose }:{ images: string[], start?: number, onClose: ()=>void }){
  const [index, setIndex] = useState(start)

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

  if(!images || images.length===0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative max-w-4xl w-full mx-4" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-2 top-2 text-white bg-black/50 rounded px-2 py-1">✕</button>
        <button onClick={()=>setIndex(i=> (i-1+images.length)%images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded px-2 py-1">◀</button>
        <img src={images[index]} alt={`Image ${index+1}`} className="w-full h-[70vh] object-contain rounded" />
        <button onClick={()=>setIndex(i=> (i+1)%images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded px-2 py-1">▶</button>
        <div className="mt-2 text-center text-white">{index+1} / {images.length}</div>
      </div>
    </div>
  )
}
