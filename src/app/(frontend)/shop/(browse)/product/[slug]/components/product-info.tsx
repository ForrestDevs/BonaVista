'use client'

import { useProduct } from '../context/product-context'
import { Badge } from '@/components/ui/badge'

export function ProductInfo() {
  const { product, currentSku } = useProduct()

  const currentCompatibility = product.compatibility
  const productCollections = product.collections

  const infoSections = [
    {
      label: 'SKU',
      value: currentSku || 'N/A',
    },
    {
      label: 'Compatibility',
      value: currentCompatibility 
        ? currentCompatibility
            .join('-')
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        : 'N/A',
    },
    {
      label: 'Collections',
      value: productCollections?.length
        ? productCollections
            .map((collection) => (typeof collection === 'string' ? collection : collection.title))
            .join(', ')
        : 'N/A',
    },
  ]

  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="grid gap-6">
        {infoSections.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <span className="font-medium text-muted-foreground">{label}</span>
            {label === 'Collections' && value !== 'N/A' ? (
              <div className="flex flex-wrap gap-2 justify-end">
                {(typeof value === 'string' ? value.split(', ') : value).map((collection) => (
                  <Badge 
                    key={collection} 
                    variant="secondary"
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {collection.trim().replace(/^"(.*)"$/, '$1')}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="font-medium text-foreground">{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
