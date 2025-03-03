import type { CollectionBeforeChangeHook } from 'payload'
import type { Product } from '@/payload-types'

export const setPriceMinMax: CollectionBeforeChangeHook<Product> = async ({
  data,
  req,
  originalDoc,
}) => {
  const { payload } = req
  const newData = { ...data }

  // Skip if we're not changing price-related fields
  //   if (
  //     data.priceMin === originalDoc?.priceMin &&
  //     data.priceMax === originalDoc?.priceMax &&
  //     data.baseProduct?.price === originalDoc?.baseProduct?.price &&
  //     JSON.stringify(data.variants?.variantProducts) ===
  //       JSON.stringify(originalDoc?.variants?.variantProducts)
  //   ) {
  //     return data
  //   }

  try {
    // Case 1: Base product (no variants)
    if (!data.enableVariants) {
      const basePrice = data.baseProduct?.price || 0
      newData.priceMin = basePrice
      newData.priceMax = basePrice
    }
    // Case 2: Product with variants
    else if (data.variants?.variantProducts?.length) {
      // Extract all variant prices
      const variantPrices = data.variants.variantProducts
        .map((variant) => variant.price || 0)
        .filter((price) => price > 0)

      if (variantPrices.length > 0) {
        // Find min and max prices
        newData.priceMin = Math.min(...variantPrices)
        newData.priceMax = Math.max(...variantPrices)
      } else {
        // No valid prices found in variants
        newData.priceMin = 0
        newData.priceMax = 0
      }
    } else {
      // No price defined yet
      newData.priceMin = 0
      newData.priceMax = 0
    }

    payload.logger.info(`Updated price range: ${newData.priceMin} - ${newData.priceMax}`)
  } catch (error) {
    payload.logger.error(`Error calculating price range: ${error}`)
  }

  return newData
}
