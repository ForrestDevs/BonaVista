import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import getPayload from '../../utils/getPayload'
import {
  BRAND_SLUG,
  PRODUCT_CATEGORY_SLUG,
  PRODUCT_SLUG,
  SPA_SLUG,
} from '@/payload/collections/constants'
import { BasePayload } from 'payload'
import { Brand, Product, ProductCategory, Spa } from '@payload-types'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Type definitions
interface IdMapping {
  [oldId: string]: number
}

type ProductRecord = {
  _id: {
    $oid: string
  }
  _status: 'draft' | 'published'
  slug: string
  slugLock: boolean
  title: string
  description: string
  moreInfo: Product['moreInfo']
  publishedOn: {
    $date: string
  }
  enableVariants: boolean
  baseProduct: {
    sku: string
    productActive: boolean
    soldOnline: boolean
    enableInventory: boolean
    inventory: number
    price: number
    images: [
      {
        image: {
          $oid: string
        }
        id: string
      },
    ]
  }
  variants: {
    options: Product['variants']['options']
    variantProducts: {
      options: Product['variants']['variantProducts'][number]['options']
      sku: Product['variants']['variantProducts'][number]['sku']
      price: Product['variants']['variantProducts'][number]['price']
      productActive: Product['variants']['variantProducts'][number]['productActive']
      soldOnline: Product['variants']['variantProducts'][number]['soldOnline']
      enableInventory: Product['variants']['variantProducts'][number]['enableInventory']
      inventory: Product['variants']['variantProducts'][number]['inventory']
      info: Product['variants']['variantProducts'][number]['info']
      images: [
        {
          image: {
            $oid: string
          }
          id: string
        },
      ]
    }[]
  }
  brand: [
    {
      $oid: string
    },
  ]
  categories: [
    {
      $oid: string
    },
  ]
  collections: [
    {
      $oid: string
    },
  ]
  compatibility: ('hottub' | 'swimspa' | 'pool')[]
}

type BrandRecord = {
  _id: {
    $oid: string
  }
  slug: string
}

type ProductCategoryRecord = {
  _id: {
    $oid: string
  }
  slug: string
}

const CONFIG = {
  CSV_PATH: path.resolve('/Users/forrestdevs/downloads/test.products.json'),
  BRAND_JSON_PATH: path.resolve('/Users/forrestdevs/downloads/test.brands.json'),
  CATEGORY_JSON_PATH: path.resolve('/Users/forrestdevs/downloads/test.product-categories.json'),
  ID_MAPPING_PATH: path.resolve(dirname, 'products-id-mapping.json'),
  BRAND_MAPPING_PATH: path.resolve(dirname, 'brand-id-mapping.json'),
  CATEGORY_MAPPING_PATH: path.resolve(dirname, 'category-id-mapping.json'),
}

const mediaIdMapping = JSON.parse(
  await readFile(path.resolve(dirname, 'media-id-mapping.json'), 'utf-8'),
) as IdMapping

const brandIdMapping = JSON.parse(await readFile(CONFIG.BRAND_MAPPING_PATH, 'utf-8')) as IdMapping

const categoryIdMapping = JSON.parse(
  await readFile(CONFIG.CATEGORY_MAPPING_PATH, 'utf-8'),
) as IdMapping

const getMedia = (id: string) => {
  return mediaIdMapping[id] ?? null
}

const getBrand = (id: string) => {
  return brandIdMapping[id] ?? null
}

const getCategory = (id: string) => {
  return categoryIdMapping[id] ?? null
}

async function createBrandMapping(payload: BasePayload) {
  const brandJson = JSON.parse(await readFile(CONFIG.BRAND_JSON_PATH, 'utf-8')) as BrandRecord[]
  const brandIdMapping: IdMapping = {}

  for (const brand of brandJson) {
    const currentBrand = await payload
      .find({
        collection: BRAND_SLUG,
        where: {
          slug: {
            equals: brand.slug,
          },
        },
      })
      .then((res) => res.docs[0])

    if (currentBrand) {
      console.log(`Brand ${brand.slug} already exists in Payload`)
      brandIdMapping[brand._id.$oid] = currentBrand.id
    } else {
      console.log(`Brand ${brand.slug} does not exist in Payload`)
    }
  }

  await writeFile(CONFIG.BRAND_MAPPING_PATH, JSON.stringify(brandIdMapping, null, 2), 'utf-8')
}

async function createCategoryMapping(payload: BasePayload) {
  const productCategoryJson = JSON.parse(
    await readFile(CONFIG.CATEGORY_JSON_PATH, 'utf-8'),
  ) as ProductCategoryRecord[]

  const categoryIdMapping: IdMapping = {}

  for (const category of productCategoryJson) {
    const currentCategory = await payload
      .find({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          slug: {
            equals: category.slug,
          },
        },
      })
      .then((res) => res.docs[0])

    if (currentCategory) {
      console.log(`Category ${category.slug} already exists in Payload`)
      categoryIdMapping[category._id.$oid] = currentCategory.id
    } else {
      console.log(`Category ${category.slug} does not exist in Payload`)
    }
  }

  await writeFile(CONFIG.CATEGORY_MAPPING_PATH, JSON.stringify(categoryIdMapping, null, 2), 'utf-8')
}

async function createProductInPayload(
  record: ProductRecord,
  payload: BasePayload,
): Promise<number> {
  try {
    const product = await payload.create({
      collection: PRODUCT_SLUG,
      data: {
        _status: record._status,
        slug: record.slug,
        slugLock: record.slugLock,
        title: record.title,
        description: record.description,
        moreInfo: record.moreInfo,
        publishedOn: record.publishedOn.$date,
        enableVariants: record.enableVariants,
        ...(record.enableVariants === false && {
          baseProduct: {
            sku: record.baseProduct.sku,
            productActive: record.baseProduct.productActive,
            soldOnline: record.baseProduct.soldOnline,
            enableInventory: record.baseProduct.enableInventory,
            inventory: record.baseProduct.inventory ?? 0,
            price: record.baseProduct.price ?? 0,
            images: record.baseProduct.images?.map((imageIn) => ({
              image: getMedia(imageIn.image.$oid) ?? null,
            })),
          },
        }),
        ...(record.enableVariants === true && {
          variants: {
            options: record.variants.options.map((option) => ({
              label: option.label,
              slug: option.slug,
              values: option.values.map((value) => ({
                label: value.label,
                slug: value.slug,
              })),
            })),
            variantProducts: record.variants.variantProducts.map((variantIn) => ({
              options: variantIn.options,
              sku: variantIn.sku,
              price: variantIn.price,
              productActive: variantIn.productActive,
              soldOnline: variantIn.soldOnline,
              enableInventory: variantIn.enableInventory,
              inventory: variantIn.inventory,
              info: variantIn.info,
              images: variantIn.images?.map((imageIn) => ({
                image: getMedia(imageIn.image.$oid) ?? null,
              })),
            })),
          },
        }),
        brand: record.brand?.map((brand) => getBrand(brand.$oid)) ?? [],
        categories: record.categories?.map((category) => getCategory(category.$oid)) ?? [],
        compatibility: record.compatibility,
      },
    })

    return product.id
  } catch (error) {
    console.error(`Error creating product for ${record.title}:`, error)
    throw error
  }
}

async function updateProducts() {
  const payload = await getPayload()
  payload.logger.info('— Starting product updates')

  // Cache existing products
  const productCache = new Map<string, Product>()

  const existingProducts = await payload.find({
    collection: PRODUCT_SLUG,
    limit: 1000,
    depth: 1, // To get category references
  })

  existingProducts.docs.forEach((product) => {
    productCache.set(product.title, product)
  })

  payload.logger.info(`— Cached ${productCache.size} products`)

  function findRelatedProducts(currentProduct: Product): number[] {
    const MAX_RELATED_PRODUCTS = 5
    const MIN_CATEGORY_MATCHES = 2

    // Filter out current product and get other products
    const otherProducts = Array.from(productCache.values()).filter(
      (p) => p.id !== currentProduct.id && p._status === 'published',
    )

    // Score and sort products by relevance
    const scoredProducts = otherProducts.map((product) => {
      let score = 0

      // Category match score
      const categoryMatches =
        product.categories?.filter((cat) => currentProduct.categories?.includes(cat)).length ?? 0
      score += categoryMatches * 2

      // Brand match score
      if (product.brand?.[0] === currentProduct.brand?.[0]) {
        score += 1
      }

      // Compatibility match score
      const compatibilityMatches =
        product.compatibility?.filter((c) => currentProduct.compatibility?.includes(c)).length ?? 0
      score += compatibilityMatches

      return { id: product.id, score }
    })

    // Sort by score and add randomization factor for variety
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score || Math.random() - 0.5)
      .map((p) => p.id)

    // Ensure minimum category matches if possible
    const relatedProducts = new Set<number>()
    const categoryMatches = otherProducts
      .filter((p) => p.categories?.some((cat) => currentProduct.categories?.includes(cat)))
      .map((p) => p.id)
      .slice(0, MIN_CATEGORY_MATCHES)

    categoryMatches.forEach((id) => relatedProducts.add(id))

    // Fill remaining slots with highest scored products
    sortedProducts.forEach((id) => {
      if (relatedProducts.size < MAX_RELATED_PRODUCTS) {
        relatedProducts.add(id)
      }
    })

    return Array.from(relatedProducts)
  }

  for (const product of existingProducts.docs) {
    const relatedProducts = findRelatedProducts(product)
    console.log(product.title, relatedProducts)
    await payload.update({
      collection: PRODUCT_SLUG,
      id: product.id,
      data: {
        relatedProducts,
      },
    })
    console.log(`Updated ${product.title} with related products`)
  }
}

async function processJSONFile(): Promise<void> {
  const payload = await getPayload()

  try {
    payload.logger.info('Starting media migration...')

    await updateProducts()

    // Read and parse CSV
    // const jsonContent = await readFile(CONFIG.CSV_PATH, 'utf-8')
    // const data = JSON.parse(jsonContent) as ProductRecord[]

    // Initialize ID mapping
    // const idMapping: IdMapping = {}

    // Process each record
    // console.log(mediaIdMapping)
    // for (const [index, record] of data.entries()) {
    //   try {
    //     payload.logger.info(`Processing ${index + 1}/${data.length}: ${record.title}`)
    //     const newId = await createProductInPayload(record, payload)
    //     idMapping[record._id.$oid] = newId
    //   } catch (error) {
    //     console.error(`Failed to process record ${record.title}:`, error)
    //   }
    // }
    // await writeFile(CONFIG.ID_MAPPING_PATH, JSON.stringify(idMapping, null, 2), 'utf-8')

    payload.logger.info('Media migration complete!')
    // payload.logger.info(`ID mapping saved to: ${CONFIG.ID_MAPPING_PATH}`)
  } catch (error) {
    console.error('Failed to process JSON:', error)
  }
}

processJSONFile()
  .catch((error) => {
    console.error('Unhandled promise rejection:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
