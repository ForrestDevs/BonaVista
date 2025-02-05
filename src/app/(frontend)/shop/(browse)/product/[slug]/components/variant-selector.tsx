'use client'

import { useProduct } from '../context/product-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { EnhancedProductVariant } from '@/lib/types/product'

export function VariantSelector() {
  const { product, setSelectedVariant, selectedVariant } = useProduct()

  if (!product.enableVariants || !product.variants?.variantProducts?.length) {
    return null
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.variantProducts.find(
      (v) => v.id === variantId,
    ) as EnhancedProductVariant
    if (variant) {
      setSelectedVariant({
        ...variant,
      })
    }
  }

  const optionName = selectedVariant?.info.options[0].key.label || 'Option'

  return (
    <div className="space-y-2">
      <Label htmlFor="variant-select">{optionName}</Label>
      <Select onValueChange={handleVariantChange} value={selectedVariant?.id}>
        <SelectTrigger id="variant-select" className="w-full">
          <SelectValue placeholder={`Select ${optionName.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {product.variants.variantProducts.map((variant: EnhancedProductVariant) => (
            <SelectItem key={variant.id} value={variant.id}>
              {variant.info.options?.map((o: any) => o.label).join(' / ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
