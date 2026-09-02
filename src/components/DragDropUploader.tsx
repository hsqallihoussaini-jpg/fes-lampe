import { useCallback, useState } from 'react'

export default function DragDropUploader({ onFile, initialPreview }:{ onFile:(f:File)=>void, initialPreview?:string }){
  const [preview, setPreview] = useState<string | null>(initialPreview || null)

  const handleFile = useCallback((file: File | null)=>{
    if(!file) return
    setPreview(URL.createObjectURL(file))
    onFile(file)
  }, [onFile])

  function onDrop(e:any){
    e.preventDefault()
    const f = e.dataTransfer.files && e.dataTransfer.files[0]
    if(f) handleFile(f)
  }

  return (
    <div>
      <div onDrop={onDrop} onDragOver={(e)=>e.preventDefault()} className="p-4 border-dashed border-2 rounded text-center">
        <div>Glissez-déposez une image ici, ou</div>
        <div className="mt-2">
          <input type="file" accept="image/*" onChange={e=>handleFile(e.target.files ? e.target.files[0] : null)} />
        </div>
      </div>
      {preview && <img src={preview} alt="preview" className="mt-3 h-24" />}
    </div>
  )
}
