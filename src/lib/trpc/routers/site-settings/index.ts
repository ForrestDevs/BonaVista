// import configPromise from '@payload-config'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import { publicProcedure, router } from '@/lib/trpc'

// const payload = await getPayloadHMR({
//   config: configPromise,
// })

// export const siteSettingsRouter = router({
//   getSiteSettings: publicProcedure.query(async () => {
//     try {
//       const data = await payload.findGlobal({
//         slug: 'settings',
//         draft: false,
//       })

//       return data
//     } catch (error: any) {
//       console.log(error)
//       throw new Error(error.message)
//     }
//   }),
// })
