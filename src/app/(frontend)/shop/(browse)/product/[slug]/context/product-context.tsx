'use client'

import { createContext, useContext, useState } from 'react'
import type { Media, Product } from '@payload-types'

type SelectedVariant = {
  sku: string
  price: number
  images: Array<{ image?: (string | null) | Media; id?: string | null }>
  info: string | number | boolean | { [k: string]: unknown } | unknown[]
}

type ProductContextType = {
  product: Product
  selectedVariant: SelectedVariant | null
  setSelectedVariant: (variant: SelectedVariant | null) => void
  currentPrice: number
  currentImages: Array<{ image?: (string | null) | Media; id?: string | null }>
  isVariantSelected: boolean
  quantity: number
  setQuantity: (quantity: number) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({
  children,
  product,
}: {
  children: React.ReactNode
  product: Product
}) {
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant | null>(
    product.enableVariants && product.variants?.variantProducts?.length
      ? {
          sku: product.variants.variantProducts[0].sku,
          price: product.variants.variantProducts[0].price,
          images: product.variants.variantProducts[0].images,
          info: product.variants.variantProducts[0].info,
        }
      : null,
  )
  const [quantity, setQuantity] = useState(1)

  // Reset quantity when variant changes
  const handleVariantChange = (variant: SelectedVariant | null) => {
    setSelectedVariant(variant)
    setQuantity(1)
  }

  const currentPrice = selectedVariant?.price ?? product.baseProduct.price
  const currentImages = selectedVariant?.images ?? product.baseProduct.images
  const isVariantSelected = Boolean(selectedVariant)

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedVariant,
        setSelectedVariant: handleVariantChange,
        currentPrice,
        currentImages,
        isVariantSelected,
        quantity,
        setQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
