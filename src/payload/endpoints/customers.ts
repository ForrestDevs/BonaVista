import type { PayloadHandler, PayloadRequest } from 'payload'
import { checkRole } from '../collections/Users/checkRole'
import { stripe } from '@/payload/stripe'

const logs = process.env.LOGS_STRIPE_PROXY === '1'

// use this handler to get all Stripe customers
// prevents unauthorized or non-admin users from accessing all Stripe customers
// GET /api/customers
export const customersProxy: PayloadHandler = async (req: PayloadRequest) => {
  if (!req.user || !checkRole(['admin'], req.user)) {
    if (logs) req.payload.logger.error({ err: `You are not authorized to access customers` })
    return new Response('You are not authorized to access customers', { status: 401 })
  }

  try {
    const customers = await stripe.customers.list({
      limit: 100,
    })

    return new Response(JSON.stringify(customers), { status: 200 })
  } catch (error: unknown) {
    if (logs) req.payload.logger.error({ err: `Error using Stripe API: ${error}` })
    return new Response(`Error using Stripe API: ${error}`, { status: 500 })
  }
}
