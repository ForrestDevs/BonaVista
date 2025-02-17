// // import React, { Suspense } from 'react'

// // import FilterList from '.'

// // import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'

// // async function CategoryList() {
// //

// //   const categories = (
// //     await payload.find({
// //       collection: PRODUCT_CATEGORY_SLUG,
// //       sort: 'title',
// //     })
// //   ).docs?.map((category) => {
// //     return {
// //       path: `/shop/search/${category.slug}`,
// //       title: category.title,
// //     }
// //   })

// //   return <FilterList list={categories} title="Categories" />
// // }

// // export default function Categories() {
// //   return (
// //     <Suspense
// //       fallback={
// //         <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
// //           <div className={clsx(skeleton, activeAndTitles)} />
// //           <div className={clsx(skeleton, activeAndTitles)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //           <div className={clsx(skeleton, items)} />
// //         </div>
// //       }
// //     >
// //       <CategoryList />
// //     </Suspense>
// //   )
// // }

// import clsx from 'clsx'
// import React, { Suspense } from 'react'
// import { Product } from '@payload-types'
// import getPayload from '@lib/utils/getPayload'
// import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'
// import { CategoryOptions } from './category-filter.client'

// const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded'
// const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300'
// const items = 'bg-neutral-400 dark:bg-neutral-700'

// type CategoryFilterProps = {
//   products: Product[]
// }

// export async function CategoryFilter({ products }: CategoryFilterProps) {
//   const payload = await getPayload()
//   const uniqueCategories = getUniqueCategories(products)
//   const categoryDocs = await Promise.all(
//     uniqueCategories.map(async (categoryId) => {
//       const category = await payload.findByID({
//         collection: PRODUCT_CATEGORY_SLUG,
//         id: categoryId,
//       })
//       return category
//     }),
//   )
//   const categories = categoryDocs.map((category) => ({
//     slug: category.slug,
//     title: category.title,
//   }))

//   return (
//     <Suspense
//       fallback={
//         <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
//           <div className={clsx(skeleton, activeAndTitles)} />
//           <div className={clsx(skeleton, activeAndTitles)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//           <div className={clsx(skeleton, items)} />
//         </div>
//       }
//     >
//       <CategoryOptions categories={categories} />
//     </Suspense>
//   )
// }

// function getUniqueCategories(products: Product[]): string[] {
//   const categoriesSet = new Set<string>()

//   products.forEach((product) => {
//     if (Array.isArray(product.categories)) {
//       product.categories.forEach((category) => {
//         if (typeof category === 'string') {
//           categoriesSet.add(category)
//         } else if (typeof category === 'object' && category.id) {
//           categoriesSet.add(category.id)
//         }
//       })
//     }
//   })

//   return Array.from(categoriesSet)
// }
