'use client'

import { createContext, useContext, useState, useMemo } from 'react'
import type { Media, Product } from '@payload-types'
import { EnhancedProductVariant } from '@/lib/types/product'

type ProductContextType = {
  product: Product
  selectedVariant: EnhancedProductVariant | null
  setSelectedVariant: (variant: EnhancedProductVariant | null) => void
  currentPrice: number
  currentImages: Array<{ image?: (number | null) | Media; id?: string | null }>
  allImages: Array<{ image?: (number | null) | Media; id?: string | null }>
  isVariantSelected: boolean
  quantity: number
  setQuantity: (quantity: number) => void
  currentSku: string
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({
  children,
  product,
}: {
  children: React.ReactNode
  product: Product
}) {
  const [selectedVariant, setSelectedVariant] = useState<EnhancedProductVariant | null>(() => {
    if (product.variants && product.variants.variantProducts.length > 0) {
      const variant = product.variants.variantProducts[0] as EnhancedProductVariant
      return {
        ...variant,
      }
    }
    return null
  })
  const [quantity, setQuantity] = useState(1)

  // Reset quantity when variant changes
  const handleVariantChange = (variant: EnhancedProductVariant | null) => {
    setSelectedVariant(variant)
    setQuantity(1)
  }

  const currentPrice = selectedVariant?.price ?? product.baseProduct.price
  const currentImages = selectedVariant?.images ?? product.baseProduct.images
  const currentSku = selectedVariant?.sku ?? product.baseProduct.sku

  const isVariantSelected = Boolean(selectedVariant)

  // Combine all images from base product and variants
  const allImages = useMemo(() => {
    const baseImages = product.baseProduct?.images || []
    const variantImages = product.enableVariants
      ? product.variants?.variantProducts?.flatMap((variant) => variant.images || []) || []
      : []

    // Remove duplicates based on image id
    const uniqueImages = [...baseImages, ...variantImages].filter(
      (image, index, self) => index === self.findIndex((t) => t.image === image.image),
    )

    return uniqueImages
  }, [product])

  return (
    <ProductContext.Provider
      value={{
        product,
        selectedVariant,
        setSelectedVariant: handleVariantChange,
        currentPrice,
        currentImages,
        allImages,
        isVariantSelected,
        quantity,
        setQuantity,
        currentSku,
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
