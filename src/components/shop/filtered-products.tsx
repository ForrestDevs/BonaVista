// import React from 'react'
// import { getCachedDocument, getCachedDocuments } from '@lib/utils/getDocument'
// import { PRODUCT_SLUG } from '@payload/collections/constants'
// import { notFound } from 'next/navigation'
// import { CategoryFilter } from './filter/category-filter'
// import Grid from '@components/payload/grid'
// import ProductGridItems from './product-grid-items'
// import { QueryClient } from '@tanstack/react-query'

// interface FilteredProductsProps {
//   slug?: string
//   searchValue?: string
//   category: string
//   sort: string
// }

// export async function FilteredProducts({
//   slug,
//   searchValue,
//   category,
//   sort,
// }: FilteredProductsProps) { 
//   const { products, collection } = await getBaseProducts({ slug, searchValue })

//   const filteredProducts = products
//     .filter((product) => {
//       if (category) {
//         const categories = Array.isArray(category) ? category : [category]
//         return product.categories.some((cat) => {
//           if (typeof cat === 'string') {
//             return categories.includes(cat)
//           } else {
//             return categories.includes(cat.slug)
//           }
//         })
//       }
//       return true
//     })
//     .sort((a, b) => {
//       switch (sort) {
//         case 'price':
//           return (
//             (a.enableVariants
//               ? Math.min(...a.variants.variantProducts.map((v) => v.price))
//               : a.baseProduct.price) -
//             (b.enableVariants
//               ? Math.min(...b.variants.variantProducts.map((v) => v.price))
//               : b.baseProduct.price)
//           )
//         case '-price':
//           return (
//             (b.enableVariants
//               ? Math.max(...b.variants.variantProducts.map((v) => v.price))
//               : b.baseProduct.price) -
//             (a.enableVariants
//               ? Math.max(...a.variants.variantProducts.map((v) => v.price))
//               : a.baseProduct.price)
//           )
//         case '-createdAt':
//           return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//         default:
//           return a.title.localeCompare(b.title) // Sort alphabetically by title
//       }
//     })

//   const resultsText = filteredProducts.length > 1 ? 'results' : 'result'

//   return (
//     <React.Fragment>
//       <div className="order-first w-full flex-none md:max-w-[125px]">
//         <CategoryFilter products={products} />
//       </div>

//       <div className="order-last min-h-screen w-full md:order-none">
//         <div className="space-y-4">
//           {searchValue && (
//             <p className="mb-4">
//               {filteredProducts?.length === 0
//                 ? 'There are no products that match '
//                 : `Showing ${filteredProducts.length} ${resultsText} for `}
//               <span className="font-bold">&quot;{searchValue}&quot;</span>
//               {category && (
//                 <>
//                   {` in ${Array.isArray(category) && category.length > 1 ? 'categories' : 'category'} `}
//                   <span className="font-bold">
//                     {Array.isArray(category) ? category.join(', ') : category}
//                   </span>
//                 </>
//               )}
//             </p>
//           )}
//           {collection && (
//             <React.Fragment>
//               <h1 className="text-2xl font-bold">{collection.title}</h1>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
//                 {category && (
//                   <>
//                     {' in '}
//                     <span className="font-semibold">
//                       {Array.isArray(category) ? category.join(', ') : category}
//                     </span>
//                   </>
//                 )}
//               </p>
//             </React.Fragment>
//           )}
//           {filteredProducts?.length > 0 ? (
//             <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//               <ProductGridItems products={filteredProducts} />
//             </Grid>
//           ) : null}
//         </div>
//       </div>
//     </React.Fragment>
//   )
// }

// interface BaseProductsProps {
//   slug?: string
//   searchValue?: string
// }

// async function getBaseProducts({ slug, searchValue }: BaseProductsProps) {
//   if (slug) {
//     const collection = await getCachedDocument<typeof SHOP_COLLECTION_SLUG>(
//       SHOP_COLLECTION_SLUG,
//       slug,
//     )
//     console.log('collection', collection)
//     if (!collection) {
//       notFound()
//     }
//     const products = await getCachedDocuments<typeof PRODUCT_SLUG>({
//       collection: PRODUCT_SLUG,
//       where: {
//         collections: {
//           contains: collection.id,
//         },
//       },
//       depth: 1,
//     })
//     return {
//       products,
//       collection,
//     }
//   }

//   if (searchValue) {
//     const products = await getCachedDocuments<typeof PRODUCT_SLUG>({
//       collection: PRODUCT_SLUG,
//       ...(searchValue.length > 0
//         ? {
//             where: {
//               or: [
//                 {
//                   title: {
//                     like: searchValue,
//                   },
//                 },
//                 {
//                   slug: {
//                     like: searchValue,
//                   },
//                 },
//                 {
//                   description: {
//                     like: searchValue,
//                   },
//                 },
//               ],
//             },
//           }
//         : {}),
//       depth: 1,
//     })
//     return {
//       products,
//       collection: null,
//     }
//   }
//   return {
//     products: [],
//     collection: null,
//   }
// }
