import type { PayloadHandler, PayloadRequest } from 'payload'
import { checkRole } from '../collections/Users/checkRole'
import { stripe } from '@/payload/stripe'

const logs = process.env.LOGS_STRIPE_PROXY === '1'

// use this handler to get all Stripe products
// prevents unauthorized or non-admin users from accessing all Stripe products
// GET /api/products
export const productsProxy: PayloadHandler = async (req: PayloadRequest) => {
  if (!req.user || !checkRole(['admin'], req.user)) {
    if (logs) req.payload.logger.error({ err: `You are not authorized to access products` })
    return new Response('You are not authorized to access products', { status: 401 })
  }

  try {
    const products = await stripe.products.list({
      limit: 100,
    })

    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error: unknown) {
    if (logs) req.payload.logger.error({ err: `Error using Stripe API: ${error}` })
    return new Response(`Error using Stripe API: ${error}`, { status: 500 })
  }
}