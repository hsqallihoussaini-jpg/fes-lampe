import { useState, useCallback } from 'react'

type Item = { id: string, file?: File, url?: string }

export default function MultiImageUploader({ initial = [], onChange }:{ initial?: string[], onChange: (items: Item[])=>void }){
  const [items, setItems] = useState<Item[]>(initial.map((u,i)=>({ id: String(Date.now()+i), url: u })))

  const notify = useCallback((next: Item[])=>{ setItems(next); onChange(next) }, [onChange])

  function addFile(f: File){
    const it = { id: String(Date.now()), file: f }
    notify([...items, it])
  }

  function onInput(e:any){
    const files = e.target.files ? Array.from(e.target.files) : []
    if(files.length){
      const nextItems = files.map((file:any, idx:number) => ({ id: `${Date.now()}-${idx}`, file }))
      notify([...items, ...nextItems])
    }
  }

  function onDrop(e:any){
    e.preventDefault()
    const f = e.dataTransfer.files
    if(f && f.length){
      const newItems = Array.from(f).map((file:any, idx)=>({ id: String(Date.now()+idx), file }))
      notify([...items, ...newItems])
    }
  }

  function remove(id:string){ notify(items.filter(i=>i.id!==id)) }

  function move(idx:number, dir:number){
    const next = [...items]
    const a = next[idx]
    const b = next[idx+dir]
    if(!b) return
    next[idx] = b
    next[idx+dir] = a
    notify(next)
  }

  return (
    <div className="vendor-uploader">
      <div onDrop={onDrop} onDragOver={(e)=>e.preventDefault()} className="vendor-uploader-dropzone">
        <div className="text-sm uppercase tracking-[0.24em] text-[#d3ad77]">Images produit</div>
        <div className="max-w-xs text-sm leading-relaxed text-[#d0b89d]">Glissez-déposez des images ici, ou choisissez des fichiers depuis votre appareil.</div>
        <div>
          <input type="file" accept="image/*" multiple onChange={onInput} className="text-[#f8efdf]" />
        </div>
      </div>
      <div className="vendor-uploader-thumbs">
        {items.map((it, idx) => (
          <div key={it.id} className="vendor-uploader-thumb">
            <div className="overflow-hidden">
              {it.url ? <img src={it.url} className="h-full w-full object-cover" /> : (it.file ? <img src={URL.createObjectURL(it.file)} className="h-full w-full object-cover" /> : null)}
            </div>
            <div className="vendor-uploader-controls">
              <button onClick={()=>move(idx,-1)} className="vendor-icon-button" aria-label="Déplacer vers la gauche">◀</button>
              <button onClick={()=>move(idx,1)} className="vendor-icon-button" aria-label="Déplacer vers la droite">▶</button>
              <button onClick={()=>remove(it.id)} className="vendor-icon-button text-[#e4b8a4]" aria-label="Supprimer l’image">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
