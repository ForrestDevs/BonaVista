import type { PayloadHandler } from 'payload'
import type { CartItems } from '@/payload-types'
import { USER_SLUG } from '../collections/constants'
import { stripe } from '@/payload/stripe'


// this endpoint creates a `PaymentIntent` with the items in the cart
// to do this, we loop through the items in the cart and lookup the product in Stripe
// we then add the price of the product to the total
// once completed, we pass the `client_secret` of the `PaymentIntent` back to the client which can process the payment
export const createPaymentIntent: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const fullUser = await payload.findByID({
    id: user?.id,
    collection: USER_SLUG,
  })

  if (!fullUser) {
    return new Response('User not found', { status: 404 })
  }

  try {
    let stripeCustomerID = fullUser?.stripeCustomerID

    // lookup user in Stripe and create one if not found
    if (!stripeCustomerID) {
      const customer = await stripe.customers.create({
        name: fullUser?.name,
        email: fullUser?.email,
      })

      stripeCustomerID = customer.id

      await payload.update({
        id: user?.id,
        collection: 'users',
        data: {
          stripeCustomerID,
        },
      })
    }

    let total = 0

    const hasItems = fullUser?.cart?.items?.length > 0

    if (!hasItems) {
      throw new Error('No items in cart')
    }

    // for each item in cart, lookup the product in Stripe and add its price to the total
    await Promise.all(
      fullUser?.cart?.items?.map(async (item: CartItems[0]): Promise<Response> => {
        const { product, quantity } = item

        if (!quantity) {
          return null
        }

        if (typeof product === 'string' || !product?.stripeProductID) {
          throw new Error('No Stripe Product ID')
        }

        const prices = await stripe.prices.list({
          expand: ['data.product'],
          limit: 100,
          product: product.stripeProductID,
        })

        if (prices.data.length === 0) {
          return new Response('There are no items in your cart to checkout with', { status: 404 })
        }

        const price = prices.data[0]
        total += price.unit_amount * quantity

        return null
      }),
    )

    if (total === 0) {
      throw new Error('There is nothing to pay for, add some items to your cart and try again.')
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      customer: stripeCustomerID,
      payment_method_types: ['card'],
    })

    return new Response(JSON.stringify({ client_secret: paymentIntent.client_secret }))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    return new Response(message, { status: 500 })
  }
}
