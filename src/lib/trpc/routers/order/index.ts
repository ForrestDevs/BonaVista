import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { COLLECTION_SLUG_ORDERS } from '@/payload/collections/constants'
import { publicProcedure, router } from '@/lib/trpc'
import getPayload from '@/lib/utils/getPayload'

const payload = await getPayload()

export const orderRouter = router({
  getOrderById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const { id } = input

        const { docs } = await payload.find({
          collection: COLLECTION_SLUG_ORDERS,
          where: { id: { equals: id } },
          depth: 3,
        })

        if (!docs?.length) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
        }

        return docs.at(0)
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error
        }

        console.error('Error fetching order data:', error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error',
        })
      }
    }),

  getAllOrders: publicProcedure.query(async () => {
    try {
      const { docs } = await payload.find({
        collection: 'orders',
        draft: false,
      })

      return docs
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),
})
