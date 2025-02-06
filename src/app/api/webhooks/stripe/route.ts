import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Stripe } from 'stripe'
import { stripeClient } from '@/lib/stripe'
import getPayload from '@/lib/utils/getPayload'
import { ORDER_SLUG } from '@/payload/collections/constants'
import { deleteCart } from '@/lib/data/cart'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, signature!, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  const payload = await getPayload()

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Find the order with this payment intent
      const orders = await payload.find({
        collection: ORDER_SLUG,
        where: {
          stripePaymentIntentID: {
            equals: paymentIntent.id,
          },
        },
      })

      if (orders.docs.length === 0) {
        console.log(`❌ No order found for payment intent ${paymentIntent.id}`)
        return NextResponse.json(
          { message: `No order found for payment intent ${paymentIntent.id}` },
          { status: 404 },
        )
      }

      const order = orders.docs[0]

      // Update order status
      await payload.update({
        collection: ORDER_SLUG,
        id: order.id,
        data: {
          status: 'paid',
          paymentIntent: paymentIntent,
        },
      })

      // Clear the cart
      if (order.cart) {
        await deleteCart()
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Find the order with this payment intent
      const orders = await payload.find({
        collection: ORDER_SLUG,
        where: {
          stripePaymentIntentID: {
            equals: paymentIntent.id,
          },
        },
      })

      if (orders.docs.length > 0) {
        const order = orders.docs[0]
        
        // Update order status
        await payload.update({
          collection: ORDER_SLUG,
          id: order.id,
          data: {
            status: 'failed',
            paymentIntent: paymentIntent,
          },
        })
      }

      break
    }

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
} 