// import { Product } from '@medusajs/medusa'
import getPayload from '@/lib/utils/getPayload'
import { COLLECTION_SLUG_PRODUCT_COLLECTIONS } from '@/payload/collections/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
// import { getCollectionsList, getProductsList, getRegion } from '@lib/data'
// import FeaturedProducts from '@modules/home/components/featured-products'
// import Hero from '@modules/home/components/hero'
// import { ProductCollectionWithPreviews } from 'types/global'

export const metadata: Metadata = {
  title: 'Medusa Next.js Starter Template',
  description: 'A performant frontend ecommerce starter template with Next.js 14 and Medusa.',
}

// const getCollectionsWithProducts = cache(
//   async (countryCode: string): Promise<ProductCollectionWithPreviews[] | null> => {
//     const { collections } = await getCollectionsList(0, 3)

//     if (!collections) {
//       return null
//     }

//     const collectionIds = collections.map((collection) => collection.id)

//     await Promise.all(
//       collectionIds.map((id) =>
//         getProductsList({
//           queryParams: { collection_id: [id] },
//           countryCode,
//         }),
//       ),
//     ).then((responses) =>
//       responses.forEach(({ response, queryParams }) => {
//         let collection

//         if (collections) {
//           collection = collections.find(
//             (collection) => collection.id === queryParams?.collection_id?.[0],
//           )
//         }

//         if (!collection) {
//           return
//         }

//         collection.products = response.products as unknown as Product[]
//       }),
//     )

//     return collections as unknown as ProductCollectionWithPreviews[]
//   },
// )

export default async function Home() {
  
  const payload = await getPayload()

  const { docs: collections } = await payload.find({
    collection: COLLECTION_SLUG_PRODUCT_COLLECTIONS,
  })

  // const collections = await getCollectionsWithProducts(countryCode)
  // const region = await getRegion(countryCode)

  // if (!collections || !region) {
  //   return null
  // }

  return (
    <>
      {/* <Hero /> */}
      <div className="py-12">
        {collections.length === 0 && <p>No collections found</p>}
        <ul className="flex flex-col gap-x-6">
          {collections.map((collection) => {
            return (
              <li key={collection.id}>
                <>
                  <Link href={`/collections/${collection.slug}`}>{collection.title}</Link>
                  <p>{collection.description}</p>
                  {collection.products?.map((product) => {
                    if (typeof product === 'object') {
                      return (
                        <div key={product.id}>
                          <p>{product.title}</p>
                          <p>{product.priceJSON}</p>
                        </div>
                      )
                    }
                    return null
                  })}
                </>
              </li>
            )
          })}
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </>
  )
}
