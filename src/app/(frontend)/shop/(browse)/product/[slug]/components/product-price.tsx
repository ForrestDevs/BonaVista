'use client'

import Price from '@/components/payload/Price'
import { useProduct } from '../context/product-context'

export function ProductPrice() {
  const { currentPrice } = useProduct()

  return (
    <div className="mt-4">
      <span className="text-xl font-bold">
        <Price amount={currentPrice} currencyCode="CAD" />
      </span>
    </div>
  )
} 