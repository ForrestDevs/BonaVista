// import Image from "next/image";
// import type { Metadata } from "next/types";
// import { getTranslations } from "next-intl/server";
// // import * as Commerce from "commerce-kit";
// // import { ProductList } from "@/ui/products/productList";
// // import { CategoryBox } from "@/ui/CategoryBox";
// // import AccessoriesImage from "@/images/accessories.jpg";
// // import ApparelImage from "@/images/apparel.jpg";
// import { YnsLink } from "@/components/ui/link";
// // import { publicUrl } from "@/env.mjs";

// // export const metadata = {
// // 	alternates: { canonical: publicUrl },
// // } satisfies Metadata;

// export default async function Home() {
// 	const t = await getTranslations("/");

// 	// const products = await Commerce.productBrowse({ first: 6 });

// 	return (
// 		<div>
// 			<section className="rounded bg-neutral-100 py-8 sm:py-12">
// 				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
// 					<div className="max-w-md space-y-4">
// 						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
// 							{t("hero.title")}
// 						</h2>
// 						<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
// 						<YnsLink
// 							className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950"
// 							href={t("hero.link")}
// 						>
// 							{t("hero.action")}
// 						</YnsLink>
// 					</div>
// 					{/* <Image
// 						alt="Cup of coffee"
// 						loading="eager"
// 						priority={true}
// 						className="rounded"
// 						height={450}
// 						width={450}
// 						src="https://files.stripe.com/links/MDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfaDVvWXowdU9ZbWlobUIyaHpNc1hCeDM200NBzvUjqP"
// 						style={{
// 							objectFit: "cover",
// 						}}
// 						sizes="(max-width: 640px) 70vw, 450px"
// 					/> */}
// 				</div>
// 			</section>
// 			{/* <ProductList products={products} /> */}

// 			<section className="w-full py-8">
// 				HELLO 
// 			</section>
// 		</div>
// 	);
// }





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
