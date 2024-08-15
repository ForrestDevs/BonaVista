import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'
import getPayload from '@/lib/utils/getPayload'
import { POST_SLUG, POST_TAG_SLUG } from '@/payload/collections/constants'

const payload = await getPayload()

export const postRouter = router({
  getAllPosts: publicProcedure.input(z.object({ page: z.number() }))?.query(async ({ input }) => {
    const { page } = input
    try {
      const { docs, hasPrevPage, hasNextPage, totalPages } = await payload.find({
        collection: POST_SLUG,
        depth: 5,
        page: page,
        limit: 6,
        draft: false,
      })

      return { docs, meta: { hasPrevPage, hasNextPage, totalPages } }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),

  getAllPostsWithoutPagination: publicProcedure.query(async () => {
    try {
      const { docs } = await payload.find({
        collection: POST_SLUG,
        pagination: false,
        draft: false,
      })

      return docs
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),

  getAllPostsByTagWithPagination: publicProcedure
    .input(z.object({ slug: z.string(), page: z.number() }))
    ?.query(async ({ input }) => {
      try {
        const { slug, page } = input
        const { docs: tagData } = await payload.find({
          collection: POST_TAG_SLUG,
          where: {
            slug: {
              equals: slug,
            },
          },
        })

        if (!tagData.length) {
          return
        }
        const {
          docs: blogsData,
          hasNextPage,
          hasPrevPage,
          totalPages,
        } = await payload.find({
          collection: POST_SLUG,
          where: {
            'tags.value': {
              equals: tagData?.at(0)?.id,
            },
          },
          page: page,
          limit: 6,
        })
        return { blogsData, meta: { hasPrevPage, hasNextPage, totalPages } }
      } catch (error: any) {
        console.log(error)
        throw new Error(error.message)
      }
    }),

  getAllPostsByTag: publicProcedure
    .input(z.object({ slug: z.string() }))
    ?.query(async ({ input }) => {
      try {
        const { slug } = input
        const { docs: tagData } = await payload.find({
          collection: POST_TAG_SLUG,
          where: {
            slug: {
              equals: slug,
            },
          },
        })

        if (!tagData.length) {
          return
        }
        const { docs: blogsData } = await payload.find({
          collection: POST_SLUG,
          where: {
            'tags.value': {
              equals: tagData?.at(0)?.id,
            },
          },
        })
        return blogsData
      } catch (error: any) {
        console.log(error)
        throw new Error(error.message)
      }
    }),

  getPostBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { docs } = await payload.find({
          collection: POST_SLUG,
          draft: false,
          where: {
            slug: {
              equals: input.slug,
            },
          },
        })

        return docs.at(0)
      } catch (error: any) {
        console.log(error)
        throw new Error(error.message)
      }
    }),
})
