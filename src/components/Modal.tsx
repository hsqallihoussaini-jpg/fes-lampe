import React from 'react'

export default function Modal({ open, title, children, onClose }:{ open:boolean, title?:string, children:any, onClose:()=>void }){
  if(!open) return null
  return (
    <div className="vendor-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="vendor-modal w-full p-6 md:p-7">
        {title && <h3 className="mb-4 text-2xl text-[#f8efdf]">{title}</h3>}
        <div>{children}</div>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="vendor-button-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}
