import type { CollectionBeforeChangeHook } from 'payload'
import { stripeClient } from '@lib/stripe'

export const createStripeCustomer: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create' && !data.stripeCustomerID) {
    try {
      // lookup an existing customer by email and if found, assign the ID to the user
      // if not found, create a new customer and assign the new ID to the user
      const existingCustomer = await stripeClient.customers.list({
        email: data.email,
        limit: 1,
      })

      if (existingCustomer.data.length) {
        // existing customer found, assign the ID to the user
        return {
          ...data,
          stripeCustomerID: existingCustomer.data[0].id,
        }
      }

      // create a new customer and assign the ID to the user
      const customer = await stripeClient.customers.create({
        email: data.email,
      })

      return {
        ...data,
        stripeCustomerID: customer.id,
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error creating Stripe customer: ${error}`)
    }
  }

  return data
}
