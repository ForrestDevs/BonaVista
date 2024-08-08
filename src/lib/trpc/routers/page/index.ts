import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { COLLECTION_SLUG_PAGES } from '@/payload/collections/constants'
import { publicProcedure, router } from '@/lib/trpc'
import ensurePath from '@/lib/utils/ensurePath'

import getPayload from '@/lib/utils/getPayload'

const payload = await getPayload()

export const pageRouter = router({
  getPageBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        let { slug } = input
        if (!slug) slug = '/'
        if (Array.isArray(slug)) slug = slug.join('/')
        if (slug !== '/') slug = ensurePath(slug).replace(/\/$/, '')

        const { docs } = await payload.find({
          collection: COLLECTION_SLUG_PAGES,
          where: { slug: { equals: slug } },
          depth: 3,
        })

        if (!docs?.length) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
        }

        return docs.at(0)
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error
        }

        console.error('Error fetching page data:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        })
      }
    }),

  getAllPages: publicProcedure.query(async () => {
    try {
      const { docs } = await payload.find({
        collection: COLLECTION_SLUG_PAGES,
        draft: false,
      })

      return docs
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),
})
