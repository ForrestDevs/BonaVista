// import { z } from 'zod'
// import { publicProcedure, router } from '@/lib/trpc'
// import getPayload from '@/lib/utils/getPayload'

// const payload = await getPayload()

// export const tagRouter = router({
//   getTagBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
//     const { slug } = input
//     try {
//       const { docs: tag } = await payload.find({
//         collection: 'tags',
//         where: {
//           slug: {
//             equals: slug,
//           },
//         },
//       })
//       return tag?.at(0)
//     } catch (error) {}
//   }),
// })
