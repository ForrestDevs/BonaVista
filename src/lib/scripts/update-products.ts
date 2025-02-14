// import Papa from 'papaparse'
// import getPayload from '../utils/getPayload'
// import { PRODUCT_SLUG } from '@/payload/collections/constants'
// import { Product } from '@payload-types'
// import { BasePayload } from 'payload'

// function extractVariantInfo(
//   size: string,
//   payload: BasePayload,
// ): { label: string; value: string } | null {
//   payload.logger.info(`— Extracting variant info for: ${size}`)

//   if (!size) {
//     payload.logger.info(`— No size provided`)
//     return null
//   }

//   // First try to match weight/volume patterns
//   const weightMatch = size.match(/(\d+(?:\.\d+)?)\s*(kg|g|gm|ml|l|lb)\s*$/i)
//   if (weightMatch) {
//     // Standardize unit to lowercase and handle variations
//     let unit = weightMatch[2].toLowerCase()
//     switch (unit) {
//       case 'gm':
//         unit = 'g'
//         break
//       case 'l':
//         unit = 'L'
//         break
//       case 'ml':
//         unit = 'mL'
//         break
//       case 'kg':
//         unit = 'kg'
//         break
//       case 'lb':
//         unit = 'lb'
//         break
//       default:
//         payload.logger.error(`— Unknown unit: ${unit}`)
//         unit = weightMatch[2]
//         break
//     }
//     payload.logger.info(`— Weight Match found: ${weightMatch[1]} ${unit}`)
//     return {
//       label: 'Size',
//       value: `${weightMatch[1]} ${unit}`,
//     }
//   }
// }

// function getBaseProductTitle(title: string): string {
//   return title.replace(/\s+\d+(\.\d+)?\s*(kg|g|ml|l)\s*$/i, '').trim()
// }

// async function updateProducts() {
//   const payload = await getPayload()
//   payload.logger.info('— Starting product updates')

//   // Cache existing products
//   const productCache = new Map<string, Product>()

//   const existingProducts = await payload.find({
//     collection: PRODUCT_SLUG,
//     limit: 1000,
//     depth: 1, // To get category references
//   })

//   existingProducts.docs.forEach((product) => {
//     productCache.set(product.title, product)
//   })

//   payload.logger.info(`— Cached ${productCache.size} products`)

//   // Fetch CSV data
//   const response = await fetch(
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWhQK-G9A66WjSl753kkok8R1jQZLVt3apg3SJ2pNgIvomLL2rBnsfJNWe7Rbxro7veHBwpWI-mRKM/pub?gid=845501447&single=true&output=csv',
//   )
//   const csvText = await response.text()

//   const { data } = Papa.parse(csvText, {
//     header: true,
//     skipEmptyLines: true,
//   })

//   // Group variants
//   const productGroups = new Map<string, any[]>()

//   data
//     .filter((row: any) => row.active === 'T')
//     .forEach((row: any) => {
//       const baseTitle = getBaseProductTitle(row.name)
//       if (!productGroups.has(baseTitle)) {
//         productGroups.set(baseTitle, [])
//       }
//       productGroups.get(baseTitle)!.push(row)
//     })

//   // Function to find related products
//   function findRelatedProducts(currentProduct: Product): number[] {
//     const MAX_RELATED_PRODUCTS = 5
//     const MIN_CATEGORY_MATCHES = 2

//     // Filter out current product and get other products
//     const otherProducts = Array.from(productCache.values()).filter(
//       (p) => p.id !== currentProduct.id && p._status === 'published',
//     )

//     // Score and sort products by relevance
//     const scoredProducts = otherProducts.map((product) => {
//       let score = 0

//       // Category match score
//       const categoryMatches =
//         product.categories?.filter((cat) => currentProduct.categories?.includes(cat)).length ?? 0
//       score += categoryMatches * 2

//       // Brand match score
//       if (product.brand?.[0] === currentProduct.brand?.[0]) {
//         score += 1
//       }

//       // Compatibility match score
//       const compatibilityMatches =
//         product.compatibility?.filter((c) => currentProduct.compatibility?.includes(c)).length ?? 0
//       score += compatibilityMatches

//       return { id: product.id, score }
//     })

//     // Sort by score and add randomization factor for variety
//     const sortedProducts = scoredProducts
//       .sort((a, b) => b.score - a.score || Math.random() - 0.5)
//       .map((p) => p.id)

//     // Ensure minimum category matches if possible
//     const relatedProducts = new Set<number>()
//     const categoryMatches = otherProducts
//       .filter((p) => p.categories?.some((cat) => currentProduct.categories?.includes(cat)))
//       .map((p) => p.id)
//       .slice(0, MIN_CATEGORY_MATCHES)

//     categoryMatches.forEach((id) => relatedProducts.add(id))

//     // Fill remaining slots with highest scored products
//     sortedProducts.forEach((id) => {
//       if (relatedProducts.size < MAX_RELATED_PRODUCTS) {
//         relatedProducts.add(id)
//       }
//     })

//     return Array.from(relatedProducts)
//   }

//   // Update each product
//   for (const [baseTitle, variants] of productGroups) {
//     const existingProduct = productCache.get(baseTitle)
//     if (!existingProduct) {
//       payload.logger.warn(`— Product not found in database: ${baseTitle}`)
//       continue
//     }
//     payload.logger.info(`— Updating product: ${baseTitle}`)
//     const relatedProducts = findRelatedProducts(existingProduct)
//     const hasVariants = variants.length > 1
//     if (hasVariants) {
//       payload.logger.info(`— Product ${baseTitle} has variants: ${variants.length}`)
//     }

//     if (!hasVariants) {
//       // Single product
//       try {
//         await payload.update({
//           collection: PRODUCT_SLUG,
//           id: existingProduct.id,
//           data: {
//             moreInfo: {
//               root: {
//                 children: [
//                   {
//                     children: [
//                       {
//                         detail: 0,
//                         format: 0,
//                         mode: 'normal',
//                         style: '',
//                         text: variants[0].long_description,
//                         type: 'text',
//                         version: 1,
//                       },
//                     ],
//                     direction: 'ltr',
//                     format: '',
//                     indent: 0,
//                     type: 'paragraph',
//                     version: 1,
//                     textFormat: 0,
//                     textStyle: '',
//                   },
//                 ],
//                 direction: 'ltr',
//                 format: '',
//                 indent: 0,
//                 type: 'root',
//                 version: 1,
//               },
//             },
//             relatedProducts,
//           },
//         })
//       } catch (error) {
//         payload.logger.error(`— Error updating product ${baseTitle}:`, error)
//       }
//     } else {
//       // Process all variant info upfront
//       const variantsInfo = variants.map((v) => ({
//         ...v,
//         variantInfo: extractVariantInfo(v.size, payload),
//       }))

//       const firstVariantInfo = variantsInfo[0].variantInfo
//       if (!firstVariantInfo) {
//         payload.logger.error(`— No variant info found for: ${variants[0].name}`)
//         continue
//       }
//       try {
//         await payload.update({
//           collection: PRODUCT_SLUG,
//           id: existingProduct.id,
//           data: {
//             moreInfo: {
//               root: {
//                 children: [
//                   {
//                     children: [
//                       {
//                         detail: 0,
//                         format: 0,
//                         mode: 'normal',
//                         style: '',
//                         text: variants[0].long_description,
//                         type: 'text',
//                         version: 1,
//                       },
//                     ],
//                     direction: 'ltr',
//                     format: '',
//                     indent: 0,
//                     type: 'paragraph',
//                     version: 1,
//                     textFormat: 0,
//                     textStyle: '',
//                   },
//                 ],
//                 direction: 'ltr',
//                 format: '',
//                 indent: 0,
//                 type: 'root',
//                 version: 1,
//               },
//             },
//             relatedProducts,
//             variants: {
//               variantProducts: existingProduct.variants.variantProducts.map((existingVariant) => {
//                 const variant = variantsInfo.find((v) => v.sku === existingVariant.sku)
//                 return {
//                   options: [variant.variantInfo?.value.toLowerCase().replace(/\s+/g, '-') || ''],
//                   sku: existingVariant.sku,
//                   price: existingVariant.price,
//                   productActive: existingVariant.productActive,
//                   soldOnline: existingVariant.soldOnline,
//                   images: existingVariant.images,
//                   info: {
//                     options: [
//                       {
//                         slug: variant.variantInfo?.value.toLowerCase().replace(/\s+/g, '-') || '',
//                         key: {
//                           slug: 'size',
//                           label: 'Size',
//                         },
//                         label: variant.variantInfo?.value || '',
//                       },
//                     ],
//                   },
//                 }
//               }),
//             },
//           },
//         })
//       } catch (error) {
//         payload.logger.error(`— Error updating product ${baseTitle}:`, error)
//       }
//     }
//   }

//   payload.logger.info('— Updates completed')
// }

// // // Run the update
// updateProducts()
//   .then(() => {
//     console.log('Update completed successfully')
//     process.exit(0)
//   })
//   .catch((error) => {
//     console.error('Update failed:', error)
//     process.exit(1)
//   })

// async function updateAmazePlus() {
//   const payload = await getPayload()
//   payload.logger.info('— Starting Amaze Plus updates')

//   // Cache existing products
//   const productCache = new Map<string, Product>()

//   const existingProducts = await payload.find({
//     collection: PRODUCT_SLUG,
//     limit: 1000,
//     depth: 1, // To get category references
//   })

//   existingProducts.docs.forEach((product) => {
//     productCache.set(product.title, product)
//   })

//   const amaze = await payload.findByID({
//     collection: PRODUCT_SLUG,
//     id: '67a1d872f69929cf5c183c32',
//     depth: 1,
//   })

//   function findRelatedProducts(currentProduct: Product): string[] {
//     const relatedProducts = new Set<string>()
//     const otherProducts = Array.from(productCache.values()).filter(
//       (p) => p.id !== currentProduct.id,
//     )

//     // First try to find products in the same categories
//     const sameCategory = otherProducts
//       .filter((p) => p.categories?.some((cat) => currentProduct.categories?.includes(cat)))
//       .sort(() => Math.random() - 0.5) // Randomize selection
//       .slice(0, 5)

//     sameCategory.forEach((p) => relatedProducts.add(p.id))

//     // If we need more, add random products from other categories
//     if (relatedProducts.size < 2) {
//       const remaining = otherProducts
//         .filter((p) => !relatedProducts.has(p.id))
//         .sort(() => Math.random() - 0.5)
//         .slice(0, 2)

//       remaining.forEach((p) => relatedProducts.add(p.id))
//     }

//     return Array.from(relatedProducts).slice(0, 5)
//   }

//   const relatedProducts = findRelatedProducts(amaze)

//   try {
//     await payload.update({
//       collection: PRODUCT_SLUG,
//       id: amaze.id,
//       data: {
//         relatedProducts,
//         moreInfo: {
//           root: {
//             children: [
//               {
//                 children: [
//                   {
//                     detail: 0,
//                     format: 0,
//                     mode: 'normal',
//                     style: '',
//                     text: 'Powerful active oxygen shock treament with a chlorine boost. Use weekly to rid pool water of non-filterable wastes, restoring water sparkle and comfort while providing a gentle boost to the chlorine residual. Contains a blend of oxidizers, clarifiers and water enhancers for optimal performance. Ideal for use with chlorine sanitizers. Recommended as Step 1 of the PureWow Pool Care System.',
//                     type: 'text',
//                     version: 1,
//                   },
//                 ],
//                 direction: 'ltr',
//                 format: '',
//                 indent: 0,
//                 type: 'paragraph',
//                 version: 1,
//                 textFormat: 0,
//                 textStyle: '',
//               },
//             ],
//             direction: 'ltr',
//             format: '',
//             indent: 0,
//             type: 'root',
//             version: 1,
//           },
//         },
//       },
//     })
//   } catch (error) {
//     payload.logger.error(`— Error updating product Amaze Plus`, error)
//   }
// }

// // updateAmazePlus()
// //   .then(() => {
// //     process.exit(0)
// //   })
// //   .catch((error) => {
// //     process.exit(1)
// //   })
