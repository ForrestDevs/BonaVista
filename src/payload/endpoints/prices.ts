// import type { PayloadHandler, PayloadRequest } from 'payload'
// import { checkRole } from '../collections/Users/checkRole'
// import { stripe } from '@/payload/stripe'

// const logs = process.env.LOGS_STRIPE_PROXY === '1'

// // use this handler to get Stripe prices for a specific product
// // prevents unauthorized or non-admin users from accessing Stripe prices
// // GET /api/stripe/prices?product=<productId>
// export const pricesProxy: PayloadHandler = async (req: PayloadRequest) => {
//   if (!req.user || !checkRole(['admin'], req.user)) {
//     if (logs) req.payload.logger.error({ err: `You are not authorized to access prices` })
//     return new Response('You are not authorized to access prices', { status: 401 })
//   }

//   const productId = req.query.product as string

//   if (!productId) {
//     return new Response('Product ID is required', { status: 400 })
//   }

//   try {
//     const prices = await stripe.prices.list({
//       product: productId,
//       limit: 100,
//     })

//     return new Response(JSON.stringify(prices), { status: 200 })
//   } catch (error: unknown) {
//     if (logs) req.payload.logger.error({ err: `Error using Stripe API: ${error}` })
//     return new Response(`Error using Stripe API: ${error}`, { status: 500 })
//   }
// }
