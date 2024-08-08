import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'
import getPayload from '@/lib/utils/getPayload'

const payload = await getPayload()

export const productRouter = router({
  getallProducts: publicProcedure.query(async () => {
    try {
      const products = await payload.find({
        collection: 'products',
        depth: 5,
        pagination: false,
        draft: false,
      })
      return products?.docs
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),
  getProductById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const { id } = input
    try {
      const product = await payload.find({
        collection: 'products',
        where: {
          id: {
            equals: id,
          },
        },
        draft: false,
      })
      return product.docs[0]
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }),
})
