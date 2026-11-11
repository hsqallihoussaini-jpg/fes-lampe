export const productCategories = [
  { value: 'lampes & luminaires', label: 'Lampes & luminaires' },
  { value: 'décoration', label: 'Décoration' },
  { value: 'bijoux & accessoires', label: 'Bijoux & accessoires' },
  { value: 'créations personnalisées', label: 'Créations personnalisées' },
  { value: 'pièces uniques', label: 'Pièces uniques' },
] as const

export const stockStatuses = [
  { value: 'IN_STOCK', label: 'En stock' },
  { value: 'OUT_OF_STOCK', label: 'Rupture de stock' },
  { value: 'ON_ORDER', label: 'Sur commande' },
] as const

export const pricingModes = [
  { value: 'FIXED', label: 'Prix fixe' },
  { value: 'NEGOTIABLE', label: 'Négocier avec le vendeur' },
] as const

export const defaultWhatsappNumber = '212XXXXXXXXX'

export function stockLabel(status?: string, inStock?: boolean) {
  if (status === 'OUT_OF_STOCK' || inStock === false) return 'Rupture de stock'
  if (status === 'ON_ORDER') return 'Sur commande'
  return 'En stock'
}
