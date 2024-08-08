import type { PayloadHandler, PayloadRequest } from 'payload'
import { stripe } from '@/payload/stripe'
import Stripe from 'stripe'

const logs = process.env.LOGS_STRIPE_PROXY === '1'


/**
 * Handles requests to interact with a Stripe customer associated with a user.
 * This endpoint provides a secure way to interact with the Stripe API without leaking or exposing cross-customer data.
 * 
 * Available methods:
 * - GET /api/users/:id/customer
 * - POST /api/users/:id/customer
 * - body: { customer: Stripe.CustomerUpdateParams }
 * 
 * @param req - The payload request object.
 * @returns A response object with the result of the request.
 */
export const customerProxy: PayloadHandler = async (req: PayloadRequest) => {
  const { id } = req.user

  if (!req.user) {
    if (logs) req.payload.logger.error({ err: `You are not authorized to access this customer` })
    return new Response('You are not authorized to access this customer', { status: 401 })
  }

  if (!req.user?.stripeCustomerID) {
    const message = `No stripeCustomerID found for user ${id}`
    if (logs) req.payload.logger.error({ err: message })
    return new Response(message, { status: 401 })
  }

  try {
    let response:
      | Array<Stripe.Customer | Stripe.DeletedCustomer>
      | Stripe.ApiList<Stripe.Customer | Stripe.DeletedCustomer>
      | Stripe.Customer
      | Stripe.DeletedCustomer

    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null

    if (req.user.stripeCustomerID) {
      // look up the customer to ensure that it belongs to the user
      // this will ensure that this user is allows perform operations on it
      customer = await stripe.customers.retrieve(req.user.stripeCustomerID, {
        expand: ['invoice_settings.default_payment_method'],
      })

      if (customer.deleted) {
        return new Response(`Customer ${req.user.stripeCustomerID} not found`, { status: 404 })
      }

      // ensure the customer belongs to the user
      if (customer.id !== req.user.stripeCustomerID) {
        return new Response(`You are not authorized to access this customer`, { status: 401 })
      }
    }

    if (req.method === 'GET') {
      if (req.user.stripeCustomerID) {
        response = customer
      }
    }

    if (req.method === 'PATCH') {
      if (!req.body) throw new Error('No customer data provided')
      const customerData: Stripe.CustomerUpdateParams = await req.json()
      response = await stripe.customers.update(req.user.stripeCustomerID, customerData)
    }

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error: unknown) {
    if (logs) req.payload.logger.error({ err: `Error using Stripe API: ${error}` })
    return new Response(`Error using Stripe API: ${error}`, { status: 500 })
  }
}
