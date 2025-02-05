'use client'

import Price from '@/components/payload/Price'
import { useProduct } from '../context/product-context'
import { cn } from '@/lib/utils/cn'

export function ProductPrice() {
  const { currentPrice, product, selectedVariant } = useProduct()

  const basePrice = product.enableVariants
    ? product.variants.variantProducts[0].price
    : product.baseProduct.price

  const isOnSale = currentPrice < basePrice

  return (
    <div className="flex items-baseline gap-2">
      <span className={cn('text-2xl font-bold', isOnSale && 'text-red-600')}>
        <Price amount={currentPrice} currencyCode="CAD" />
      </span>
      {isOnSale && (
        <span className="text-lg text-muted-foreground line-through">
          <Price amount={basePrice} currencyCode="CAD" />
        </span>
      )}
    </div>
  )
}
