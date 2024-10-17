// import { z } from 'zod'
// import { publicProcedure, router } from '@/lib/trpc'
// import getPayload from '@/lib/utils/getPayload'
// import {
//   PRODUCT_COLLECTION_SLUG,
//   PRODUCT_SLUG,
// } from '@/payload/collections/constants'

// const payload = await getPayload()

// export const productRouter = router({
//   // Define your routes here
//   retrieveCollection: publicProcedure
//     .input(
//       z.object({
//         id: z.string(),
//       }),
//     )
//     .query(async ({ input }) => {
//       try {
//         const collection = await payload.find({
//           collection: PRODUCT_COLLECTION_SLUG,
//           where: {
//             id: {
//               equals: input.id,
//             },
//           },
//         })

//         return collection
//       } catch (error) {
//         throw new Error(`Failed to retrieve collection: ${error}`)
//       }
//     }),
//   getCollectionsList: publicProcedure
//     .input(
//       z.object({
//         pageParam: z.number().int().optional(),
//         limit: z.number().int().positive().optional(),
//       }),
//     )
//     .query(async ({ input }) => {
//       const collections = await payload.find({
//         collection: PRODUCT_COLLECTION_SLUG,
//         limit: input.limit,
//       })
//       return collections
//     }),
//   getCollectionBySlug: publicProcedure
//     .input(
//       z.object({
//         slug: z.string(),
//       }),
//     )
//     .query(async ({ input }) => {
//       try {
//         const collection = await payload.find({
//           collection: PRODUCT_COLLECTION_SLUG,
//           where: {
//             slug: {
//               equals: input.slug,
//             },
//           },
//         })
//         return collection
//       } catch (error) {
//         throw new Error(`Failed to get collection by handle: ${error}`)
//       }
//     }),

//   getProductsByCollectionSlug: publicProcedure
//     .input(
//       z.object({
//         pageParam: z.number().int().optional(),
//         limit: z.number().int().positive().optional(),
//         slug: z.string(),
//         countryCode: z.string(),
//         currencyCode: z.string().optional(),
//       }),
//     )
//     .query(async ({ input }) => {
//       try {
//         const products = payload.find({
//           collection: PRODUCT_SLUG,
//           where: {
//             'collection.slug': {
//               equals: input.slug,
//             },
//           },
//         })

//         return products
//       } catch (error) {
//         throw new Error(`Failed to get products by collection handle: ${error}`)
//       }
//     }),
// })
