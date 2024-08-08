import { z } from 'zod'
import { publicProcedure, router } from '@/lib/trpc'
import getPayload from '@/lib/utils/getPayload'

const payload = await getPayload()

export const authorRouter = router({
  getAllAuthorsWithCount: publicProcedure.query(async () => {
    try {
      const { docs: authors } = await payload.find({
        collection: 'users',
        where: {
          role: {
            equals: 'author',
          },
        },
      })

      const authorBlogCounts = await Promise.all(
        authors.map(async (author) => {
          const count = await payload.count({
            collection: 'posts',
            where: {
              'author.value': {
                equals: author.id,
              },
            },
          })
          return { ...author, ...count }
        }),
      )

      return authorBlogCounts
    } catch (error: any) {
      console.error(error)
      throw new Error(error.message)
    }
  }),

  getAuthorByName: publicProcedure
    .input(
      z.object({
        authorName: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { authorName } = input
      try {
        const { docs: user } = await payload.find({
          collection: 'users',
          draft: false,
          where: {
            name: {
              equals: authorName,
            },
          },
        })

        return user?.at(0)
      } catch (error: any) {
        console.log(error)
        throw new Error(error.message)
      }
    }),
})
