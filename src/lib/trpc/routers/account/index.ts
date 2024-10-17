// import { z } from 'zod'
// import { router, userProcedure } from '@/lib/trpc'
// import getPayload from '@/lib/utils/getPayload'
// import { USER_SLUG } from '@/payload/collections/constants'
// import { getFieldsToSign } from 'payload'

// const payload = await getPayload()

// const sanitizeUserData = (data: Record<string, any>) => {
//   const newData = structuredClone(data)

//   if (
//     newData.password?.length < 6 ||
//     newData.confirmPassword?.length < 6 ||
//     newData.password !== newData.confirmPassword
//   ) {
//     delete newData.password
//     delete newData.confirmPassword
//   }

//   Object.keys(newData).forEach((key) => {
//     if (!(['name', 'password'] || []).includes(key)) {
//       // @ts-ignore
//       delete newData[key]
//     }
//   })
//   return newData
// }

// export const accountRouter = router({
//   updateAccount: userProcedure
//     .input(
//       z.object({
//         id: z.string(),
//         email: z.string(),
//         name: z.string(),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       const { id, email, name } = input

//       //   const updatedUser = await payload.update({
//       //     collection: COLLECTION_SLUG_USERS,
//       //     where: {
//       //       id: {
//       //         equals: id,
//       //       },
//       //     },
//       //     data: {
//       //       email,
//       //       name,
//       //     },
//       //   })

//       //   const sanitizedUserData = sanitizeUserData(userData)

//       //   const newUser = (await payload
//       //     .update({
//       //       collection: COLLECTION_SLUG_USERS,
//       //       id: user.id,
//       //       data: sanitizedUserData,
//       //     })
//       //     .then((user) => ({ ...user, collection: COLLECTION_SLUG_USER }))) as User & {
//       //     collection: typeof COLLECTION_SLUG_USER
//       //   }

//       //   const fieldsToSign = getFieldsToSign({
//       //     user: newUser,
//       //     email: session.user.email,
//       //     collectionConfig: users,
//       //   })

//       //   return updatedUser
//     }),

//   getAccount: userProcedure.query(async ({ ctx }) => {
//     const { user } = ctx

//     const { docs } = await payload.find({
//       collection: USER_SLUG,
//       where: {
//         id: {
//           equals: user.id,
//         },
//       },
//     })

//     return docs.at(0)
//   }),
// })
