import { BasePayload } from 'payload'
import config from '@payload-config'
import Papa from 'papaparse'
import { Product, Media, Brand, ProductCategory } from '@payload-types'
import {
  BRAND_SLUG,
  MEDIA_SLUG,
  PRODUCT_CATEGORY_SLUG,
  PRODUCT_SLUG,
} from '@/payload/collections/constants'
import fs from 'fs'
import getPayload from '../utils/getPayload'
import { createHeadlessEditor } from '@lexical/headless'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'

interface Cache {
  brands: Map<string, number>
  categories: Map<string, number>
}

const cache: Cache = {
  brands: new Map(),
  categories: new Map(),
}

const lexicalEditor = createHeadlessEditor({
  namespace: 'Editor',
  nodes: [],
  onError: console.error,
})

async function plainTextToLexicalState(text: string): Promise<string> {
  return new Promise((resolve) => {
    lexicalEditor.registerUpdateListener(({ editorState }) => {
      resolve(JSON.stringify(editorState))
    })

    lexicalEditor.update(() => {
      const paragraph = $createParagraphNode()
      const textNode = $createTextNode(text)

      paragraph.append(textNode)

      $getRoot().clear().append(paragraph)
    })
  })
}

async function initializeBrands(payload: BasePayload) {
  payload.logger.info('— Initializing brands...')

  const existingBrands = await payload.find({
    collection: BRAND_SLUG,
    limit: 1000,
  })

  existingBrands.docs.forEach((brand) => {
    cache.brands.set(brand.name, brand.id)
  })

  payload.logger.info(`— Cached ${existingBrands.docs.length} existing brands`)
}

async function initializeCategories(payload: BasePayload) {
  payload.logger.info('— Initializing categories...')

  const existingCategories = await payload.find({
    collection: PRODUCT_CATEGORY_SLUG,
    limit: 1000, // Adjust based on your needs
  })

  existingCategories.docs.forEach((category) => {
    cache.categories.set(category.title, category.id)
  })

  payload.logger.info(`— Cached ${existingCategories.docs.length} existing categories`)
}

function standardizeBrandName(name: string): string {
  // Split by spaces while preserving special characters
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function getCachedBrand(brandName: string, payload: BasePayload): number | undefined {
  let standardizedName: string

  if (brandName === 'NatChem' || brandName === 'A&B') {
    standardizedName = brandName
  } else {
    standardizedName = standardizeBrandName(brandName)
  }

  const brandId = cache.brands.get(standardizedName)

  if (!brandId) {
    payload.logger.warn(`— Brand not found in cache: ${standardizedName}`)
    return undefined
  }

  payload.logger.info(`— Found cached brand: ${standardizedName}`)
  return brandId
}

function getCachedCategory(categoryName: string, payload: BasePayload): number | undefined {
  const categoryId = cache.categories.get(categoryName.trim())

  if (!categoryId) {
    payload.logger.warn(`— Category not found in cache: ${categoryName}`)
    return undefined
  }

  payload.logger.info(`— Found cached category: ${categoryName}`)
  return categoryId
}

async function createMedia(
  imageUrl: string,
  title: string,
  size: string,
  payload: BasePayload,
): Promise<number | null> {
  payload.logger.info(`— Creating media for: ${title}`)

  const validatedUrl = validate_image_url(imageUrl)

  try {
    const media = await payload.create({
      collection: MEDIA_SLUG,
      data: {
        alt: title,
        url: validatedUrl,
        filename: title + ' ' + size,
      },
    })
    return media.id
  } catch (error) {
    payload.logger.error(`— Error creating media for: ${title}`, error)
    return null
  }
}

function getBaseProductTitle(title: string): string {
  return title.replace(/\s+\d+(\.\d+)?\s*(kg|g|ml|l)\s*$/i, '').trim()
}

function validate_image_url(url: string): string {
  if (url.includes('drive.google.com')) {
    // Split URL to get the ID part
    if (url.includes('/open?id=')) {
      // Convert from /open?id= format to /uc?export=download&id= format
      const base_url = 'https://drive.google.com/uc?export=download&id='
      const file_id = url.split('/open?id=')[1]
      return `${base_url}${file_id}`
    } else if (url.includes('/uc?export=download&id=')) {
      // URL is already in correct format
      return url
    }
  }

  // Return original URL if it's not a Google Drive URL
  return url
}

function extractVariantInfo(
  size: string,
  payload: BasePayload,
): { label: string; value: string } | null {
  payload.logger.info(`— Extracting variant info for: ${size}`)

  if (!size) {
    payload.logger.info(`— No size provided`)
    return null
  }

  // First try to match weight/volume patterns
  const weightMatch = size.match(/(\d+(?:\.\d+)?)\s*(kg|g|gm|ml|l|lb)\s*$/i)
  if (weightMatch) {
    // Standardize unit to lowercase and handle variations
    let unit = weightMatch[2].toLowerCase()
    switch (unit) {
      case 'gm':
        unit = 'g'
        break
      case 'l':
        unit = 'L'
        break
      case 'ml':
        unit = 'mL'
        break
      case 'kg':
        unit = 'kg'
        break
      case 'lb':
        unit = 'lb'
        break
      default:
        payload.logger.error(`— Unknown unit: ${unit}`)
        unit = weightMatch[2]
        break
    }
    payload.logger.info(`— Weight Match found: ${weightMatch[1]} ${unit}`)
    return {
      label: 'Size',
      value: `${weightMatch[1]} ${unit}`,
    }
  }

  // Try to match pack/box patterns
  const packMatch = size.match(/(\d+)\s*(pack|box)/i)
  if (packMatch) {
    payload.logger.info(`— Pack Match found: ${packMatch[1]} ${packMatch[2].toLowerCase()}`)
    return {
      label: 'Package',
      value: `${packMatch[1]} ${packMatch[2].toLowerCase()}`,
    }
  }

  // If size exists but doesn't match our patterns, use it as is
  if (size.trim()) {
    payload.logger.info(`— Size Match found: ${size.trim()}`)
    return {
      label: 'Size',
      value: size.trim(),
    }
  }

  payload.logger.info(`— No recognized size pattern found`)
  return null
}

function determineCompatibility(categories: string[]): ('swimspa' | 'hottub' | 'pool')[] {
  const compatibility: ('swimspa' | 'hottub' | 'pool')[] = []
  const categoryStr = categories.join(' ').toLowerCase()

  if (categoryStr.includes('pool')) compatibility.push('pool')
  if (categoryStr.includes('swim spa') || categoryStr.includes('swimspa'))
    compatibility.push('swimspa')
  if (categoryStr.includes('hot tub') || categoryStr.includes('hottub'))
    compatibility.push('hottub')

  return compatibility
}

async function getOrCreateMedia(
  imageUrl: string,
  title: string,
  size: string,
  payload: BasePayload,
): Promise<number | null> {
  payload.logger.info(`— Checking media for: ${title}`)

  // First try to find existing media
  const existingMedia = await payload.find({
    collection: MEDIA_SLUG,
    where: {
      alt: {
        equals: title + ' ' + size,
      },
    },
  })

  if (existingMedia.docs.length > 0) {
    payload.logger.info(`— Found existing media for: ${title}`)
    return existingMedia.docs[0].id
  }

  payload.logger.info(`— Creating new media for: ${title}`)
  const validatedUrl = validate_image_url(imageUrl)

  try {
    const media = await payload.create({
      collection: MEDIA_SLUG,
      data: {
        alt: title + ' ' + size,
        url: validatedUrl,
        filename: title + ' ' + size,
      },
    })
    return media.id
  } catch (error) {
    payload.logger.error(`— Error creating media for: ${title}`, error)
    return null
  }
}

async function seedProducts() {
  const payload = await getPayload()
  payload.logger.info('— Starting product seeding process')

  await initializeBrands(payload)
  await initializeCategories(payload)

  // Fetch CSV data
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWhQK-G9A66WjSl753kkok8R1jQZLVt3apg3SJ2pNgIvomLL2rBnsfJNWe7Rbxro7veHBwpWI-mRKM/pub?gid=845501447&single=true&output=csv',
  )
  const csvText = await response.text()

  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  // Group variants
  const productGroups = new Map<string, any[]>()

  data
    .filter((row: any) => row.active === 'T')
    .forEach((row: any) => {
      const baseTitle = getBaseProductTitle(row.name)
      if (!productGroups.has(baseTitle)) {
        productGroups.set(baseTitle, [])
      }
      productGroups.get(baseTitle)!.push(row)
    })

  payload.logger.info(`— Found ${productGroups.size} unique products`)

  let productCount = 0
  let variantCount = 0
  let mediaCount = 0
  let products = []

  for (const [baseTitle, variants] of productGroups) {
    // payload.logger.info(`— Processing product: ${baseTitle}`)

    const brandId = getCachedBrand(variants[0].brand, payload)

    const categoryIds = await Promise.all(
      variants[0].shop_category
        .split(',')
        .map((cat) => cat.trim())
        .filter(Boolean)
        .map((cat) => getCachedCategory(cat, payload)),
    )

    const compatibility = determineCompatibility(variants[0].shop_category.split(','))

    const hasVariants = variants.length > 1

    if (hasVariants) {
      payload.logger.info(`— Product ${baseTitle} has variants: ${variants.length}`)
    }

    const moreInfoState = await plainTextToLexicalState(variants[0].long_description)

    const productData: Partial<Product> = {
      title: baseTitle,
      description: variants[0].short_description,
      //@ts-ignore
      moreInfo: moreInfoState,
      //   moreInfo: {
      //     root: {
      //       children: [
      //         {
      //           children: [
      //             {
      //               detail: 0,
      //               format: 0,
      //               mode: 'normal',
      //               style: '',
      //               text: variants[0].long_description,
      //               type: 'text',
      //               version: 1,
      //             },
      //           ],
      //           direction: 'ltr',
      //           format: '',
      //           indent: 0,
      //           type: 'paragraph',
      //           version: 1,
      //           textFormat: 0,
      //           textStyle: '',
      //         },
      //       ],
      //       direction: 'ltr',
      //       format: '',
      //       indent: 0,
      //       type: 'root',
      //       version: 1,
      //     },
      //   },
      enableVariants: hasVariants,
      brand: [brandId],
      categories: categoryIds,
      compatibility,
      _status: 'published',
    }

    if (!hasVariants) {
      // Single product
      const mediaId = await getOrCreateMedia(
        variants[0].image,
        variants[0].name,
        variants[0].size,
        payload,
      )
      productData.baseProduct = {
        soldOnline: variants[0].sold_online === 'Y',
        sku: variants[0].sku,
        productActive: true,
        price: parseFloat(variants[0].retail_price.replace(/[$,]/g, '')),
        images: [{ image: mediaId }],
      }
    } else {
      // Process all variant info upfront
      const variantsInfo = variants.map((v) => ({
        ...v,
        variantInfo: extractVariantInfo(v.size, payload),
      }))

      const firstVariantInfo = variantsInfo[0].variantInfo
      if (!firstVariantInfo) {
        payload.logger.error(`— No variant info found for: ${variants[0].name}`)
        continue
      }

      productData.variants = {
        options: [
          {
            label: firstVariantInfo.label,
            slug: firstVariantInfo.label.toLowerCase(),
            values: variantsInfo.map((v) => ({
              label: v.variantInfo?.value || '',
              slug: v.variantInfo?.value.toLowerCase().replace(/\s+/g, '-') || '',
            })),
          },
        ],
        variantProducts: await Promise.all(
          variantsInfo.map(async (variant) => {
            const mediaId = await getOrCreateMedia(
              variant.image,
              variant.name,
              variant.size,
              payload,
            )
            return {
              options: [variant.variantInfo?.value.toLowerCase().replace(/\s+/g, '-') || ''],
              sku: variant.sku,
              price: parseFloat(variant.retail_price.replace(/[$,]/g, '')),
              productActive: true,
              soldOnline: variant.sold_online === 'Y',
              images: [{ image: mediaId }],
            }
          }),
        ),
      }
    }

    productCount++
    variantCount += hasVariants ? variants.length : 1
    mediaCount += hasVariants ? variants.length : 1
    products.push(productData)
  }
  payload.logger.info(
    `— Created data for ${productCount} products, ${variantCount} variants, and ${mediaCount} media`,
  )

  fs.writeFileSync('products.json', JSON.stringify(products, null, 2))

  // Create products
//   const len = products.length
//   for (const [index, product] of products.entries()) {
//     payload.logger.info(`— Creating product ${index + 1} of ${len}: ${product.title}`)
//     await payload.create({
//       collection: PRODUCT_SLUG,
//       data: product,
//     })
//   }
  payload.logger.info('— Seeding completed successfully')
}

async function seedFromJson() {
  const payload = await getPayload()
  const products = JSON.parse(fs.readFileSync('products.json', 'utf8'))

  let productObjects = []
  for (const product of products) {
    productObjects.push(product)
  }

  const len = productObjects.length
  for (const [index, product] of products.entries()) {
    payload.logger.info(`— Creating product ${index + 1} of ${len}: ${product.title}`)
    await payload.create({
      collection: PRODUCT_SLUG,
      data: product,
    })
  }
  payload.logger.info('— Seeding completed successfully')
}

// seedFromJson()
//   .then(() => {
//     process.exit(0)
//   })
//   .catch((error) => {
//     console.error('Seeding failed:', error)
//     process.exit(1)
//   })

seedProducts()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
