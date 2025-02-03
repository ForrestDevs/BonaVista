'use server'

import getPayload from '@/lib/utils/getPayload'
import { CustomerDTO } from '../customer'
import { getCart, getCustomerCart } from '../cart'
import { ORDER_SLUG } from '@/payload/collections/constants'
import { PaymentIntent } from '@stripe/stripe-js'
import { PayloadJSON } from '@/lib/types/payload'

//DELETE CART
//Update Customer Cart ID to Null
//Delete Cart Cookie
export async function createOrder(customer: CustomerDTO, paymentIntent: PaymentIntent) {
  console.log('createOrder')
  const payload = await getPayload()
  const cart = await getCart()
  console.log('got cart', cart.id)

  const order = await payload.create({
    collection: ORDER_SLUG,
    data: {
      orderedBy: customer.id,
      total: paymentIntent.amount,
      currency: paymentIntent.currency,
      stripePaymentIntentID: paymentIntent.id,
      items: cart.items,
      paymentIntent: paymentIntent as unknown as PayloadJSON,
      status: paymentIntent.status,
      shippingRate: {
        rate: 100,
        displayName: 'Standard Shipping',
      },
    },
  })
  console.log('created order', order.id)

  return order
}
