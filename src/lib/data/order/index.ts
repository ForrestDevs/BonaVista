'use server'

import getPayload from '@/lib/utils/getPayload'
import { CustomerDTO } from '../customer'
import { getCart, getCustomerCart } from '../cart'
import { ORDER_SLUG } from '@/payload/collections/constants'
// import { PaymentIntent} from '@stripe/stripe-js'
import { PayloadJSON } from '@/lib/types/payload'

//DELETE CART
//Update Customer Cart ID to Null
//Delete Cart Cookie
type PaymentIntent = {
  total: number
  currency: string
  id: string
  status: string
  paymentIntent: any
}

export async function createOrder(id: string, paymentIntent: PaymentIntent) {
  console.log('createOrder')
  const payload = await getPayload()
  const cart = await getCart()
  console.log('got cart', cart.id)

  const order = await payload.create({
    collection: ORDER_SLUG,
    data: {
      orderedBy: id,
      total: paymentIntent.total,
      currency: paymentIntent.currency,
      stripePaymentIntentID: paymentIntent.id,
      items: cart.items,
      paymentIntent: paymentIntent as unknown as PayloadJSON,
      status: paymentIntent.status as
        | 'succeeded'
        | 'canceled'
        | 'processing'
        | 'requires_action'
        | 'requires_capture'
        | 'requires_confirmation'
        | 'requires_payment_method',
      shippingRate: {
        rate: 100,
        displayName: 'Standard Shipping',
      },
    },
  })
  console.log('created order', order.id)

  return order
}
