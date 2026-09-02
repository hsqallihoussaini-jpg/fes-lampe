export default function WhatsAppButton(){
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212XXXXXXXXX'
  const url = `https://wa.me/${wa}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[#d7b787]/70 bg-[#d7b787]/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2d9aa] transition-all duration-300 hover:border-[#f0d8ae] hover:bg-[#d7b787]/15"
    >
      <span aria-hidden="true" className="text-sm">✆</span>
      WhatsApp
    </a>
  )
}
