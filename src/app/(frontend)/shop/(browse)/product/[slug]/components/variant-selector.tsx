'use client'

import { useProduct } from '../context/product-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function VariantSelector() {
  const { product, setSelectedVariant } = useProduct()

  if (!product.enableVariants || !product.variants?.variantProducts?.length) {
    return null
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.variantProducts.find((v) => v.id === variantId)
    if (variant) {
      setSelectedVariant({
        sku: variant.sku,
        price: variant.price,
        images: variant.images,
        info: variant.info,
      })
    }
  }

  return (
    <div className="mt-6">
      <Select onValueChange={handleVariantChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select variant" />
        </SelectTrigger>
        <SelectContent>
          {product.variants.variantProducts.map((variant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {/* @ts-ignore */}
              {variant.info.options?.map((o: any) => o.label).join(' / ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
