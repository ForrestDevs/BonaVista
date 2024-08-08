// import { ContactFormValidator } from '@/lib/validator/contactValidator'
// import { publicProcedure, router } from '@/lib/trpc'

// import getPayload from '@/lib/utils/getPayload'

// const payload = await getPayload()

// export const contactRouter = router({
//   ContactFormPostData: publicProcedure
//     .input(ContactFormValidator)
//     .mutation(async ({ input }) => {
//       const { email, message, name, subject, phoneNumber } = input

//       try {
//         await payload.create({
//           collection: 'contact',
//           data: { email, message, name, subject, phoneNumber },
//         })

//         return { success: 'true' }
//       } catch (error: any) {
//         console.error(error)
//         throw new Error(error.message)
//       }
//     }),
// })
