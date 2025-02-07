'use server'

import { redis } from '@/lib/redis/client'
import { getCartCookie } from '@/lib/data/cookies'
import { createPaymentIntent } from '@/lib/data/shop'
import { redirect } from 'next/navigation'
import { stripeClient } from '@/lib/stripe'
import getPayload from '@/lib/utils/getPayload'
import { v4 as uuidv4 } from 'uuid'
import {
  BeginCheckoutParams,
  CreateStoredCheckoutParams,
  CheckoutSession,
  UpdateCheckoutStepParams,
  CheckoutStep,
  HandlePaymentSuccessParams,
  PaymentSuccessResult,
  StripeAddress,
} from '@/lib/types/checkout'
import { CART_SLUG } from '@/payload/collections/constants'
import { deleteCart } from '../cart'
import { Order } from '@payload-types'

const CHECKOUT_SESSION_EXPIRY = 1000 * 60 * 30 // 30 minutes
const ORDER_ARCHIVE_EXPIRY = 1000 * 60 * 60 * 24 * 30 // 30 days

interface GetStoredCheckoutSessionParams {
  cartId?: string
  redirectTo?: string
}

export async function getStoredCheckoutSession(
  props?: GetStoredCheckoutSessionParams,
): Promise<CheckoutSession | null> {
  const { cartId, redirectTo } = props || {}

  let validCartId = cartId
  if (!validCartId) {
    const cartCookie = await getCartCookie()

    if (!cartCookie?.id) {
      if (redirectTo) {
        redirect(redirectTo)
      }
      return null
    }

    validCartId = cartCookie.id
  }

  const redisKey = `cart_checkout_session:${validCartId}`

  const checkoutSession = await redis.get<CheckoutSession>(redisKey)

  if (!checkoutSession) {
    console.error('No checkout session found')
    if (redirectTo) {
      redirect(redirectTo)
    }
    return null
  }

  // Check if session has expired
  // if (Date.now() > checkoutSession.expiresAt) {
  //   console.error('Checkout session has expired')
  //   await redis.del(redisKey)
  //   if (redirectTo) {
  //     redirect(redirectTo)
  //   }
  //   return null
  // }

  return checkoutSession
}

export async function createStoredCheckoutSession(
  props: CreateStoredCheckoutParams,
): Promise<CheckoutSession | null> {
  const {
    amount,
    currencyCode,
    description,
    stripeCustomerId,
    metadata,
    cartId,
    lineItems,
    customerEmail,
    customerId,
    shippingTotal,
    taxAmount,
  } = props

  try {
    const amountInCents = Math.round(amount * 100)

    const paymentIntent = await createPaymentIntent({
      amount: amountInCents,
      currencyCode,
      description,
      stripeCustomerId,
      metadata: {
        ...metadata,
        cartId,
        sessionId: uuidv4(),
      },
      cartId,
    })

    if (!paymentIntent) {
      throw new Error('Failed to create payment intent')
    }

    const newCheckoutSession: CheckoutSession = {
      id: uuidv4(),
      status: 'pending',
      cartId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      amount,
      currencyCode,
      description,
      lineItems,
      stripeCustomerId,
      customerEmail,
      customerId,
      steps: {
        email: {
          completed: Boolean(customerEmail),
          value: customerEmail,
        },
        shipping: {
          completed: false,
        },
        billing: {
          completed: false,
          sameAsShipping: true,
        },
        payment: {
          completed: false,
        },
      },
      shippingTotal,
      taxAmount,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + CHECKOUT_SESSION_EXPIRY,
    }

    const redisKey = `cart_checkout_session:${cartId}`
    await redis.set<CheckoutSession>(redisKey, newCheckoutSession)

    return newCheckoutSession
  } catch (error) {
    console.error('Error creating checkout session', error)
    return null
  }
}

export async function beginCheckoutSession(props: BeginCheckoutParams): Promise<void | null> {
  const { redirectTo, ...sessionProps } = props
  console.log('begining new checkout session for cart', sessionProps.cartId)
  // Check for existing checkout session
  const checkoutSession = await getStoredCheckoutSession()

  // If checkout session exists and is valid, redirect to checkout
  if (checkoutSession) {
    console.log('checkout session found, redirecting to', redirectTo)
    redirect(redirectTo)
  }
  console.log('no checkout session found, creating new one')
  // Create new checkout session
  const newCheckoutSession = await createStoredCheckoutSession({
    ...sessionProps,
    shippingTotal: 0,
    taxAmount: 0,
  })

  if (!newCheckoutSession) {
    console.error('Error creating checkout session')
    return null
  }
  console.log('new checkout session created, redirecting to', redirectTo)
  redirect(redirectTo)
}

export async function updateCheckoutStep<T extends CheckoutStep>({
  cartId,
  step,
  data,
}: UpdateCheckoutStepParams<T>): Promise<CheckoutSession | null> {
  const redisKey = `cart_checkout_session:${cartId}`
  const session = await redis.get<CheckoutSession>(redisKey)

  if (!session) {
    console.error('Checkout session not found')
    return null
  }

  const updatedSession: CheckoutSession = {
    ...session,
    steps: {
      ...session.steps,
      [step]: {
        ...session.steps[step],
        ...data,
      },
    },
    lastUpdated: Date.now(),
  }

  await redis.set(redisKey, updatedSession)
  return updatedSession
}

export async function getOrCreateStripeCustomer(
  email: string,
  address?: StripeAddress,
): Promise<string> {
  const existingCustomers = await stripeClient.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id
  }

  const customer = await stripeClient.customers.create({
    email,
    ...(address && {
      address: {
        line1: address.address.line1,
        line2: address.address.line2,
        city: address.address.city,
        state: address.address.state,
        postal_code: address.address.postal_code,
        country: address.address.country,
      },
    }),
    name: address?.name,
    phone: address?.phone,
    metadata: {
      source: 'website_checkout_v2',
      created_at: new Date().toISOString(),
    },
  })

  return customer.id
}

export async function updatePaymentIntentWithDetails(
  session: CheckoutSession,
): Promise<CheckoutSession | null> {
  try {
    // Get or create Stripe customer if we have an email but no customer ID
    let stripeCustomerId = session.stripeCustomerId
    if (session.steps.email.value && !stripeCustomerId) {
      stripeCustomerId = await getOrCreateStripeCustomer(session.steps.email.value)
      if (!stripeCustomerId) {
        throw new Error('Failed to create/get customer')
      }
    }

    // Update payment intent
    const updatedPaymentIntent = await stripeClient.paymentIntents.update(session.paymentIntentId, {
      amount: session.amount,
      customer: stripeCustomerId,
      shipping: session.steps.shipping.address
        ? {
            address: {
              line1: session.steps.shipping.address.address.line1,
              line2: session.steps.shipping.address.address.line2 || undefined,
              city: session.steps.shipping.address.address.city,
              state: session.steps.shipping.address.address.state,
              postal_code: session.steps.shipping.address.address.postal_code,
              country: session.steps.shipping.address.address.country,
            },
            name: session.steps.shipping.address.name,
            phone: session.steps.shipping.address.phone,
          }
        : undefined,
      metadata: {
        taxCalculationId: session.taxCalculationId,
      },
      // ...(session.taxCalculationId && {
      //   async_workflows: {
      //     inputs: {
      //       tax: {
      //         calculation: session.taxCalculationId,
      //       },
      //     },
      //   },
      // }),
    })

    // Update session with new details
    const updatedSession: CheckoutSession = {
      ...session,
      stripeCustomerId,
      clientSecret: updatedPaymentIntent.client_secret!,
      lastUpdated: Date.now(),
    }

    // Store updated session
    const redisKey = `cart_checkout_session:${session.cartId}`
    await redis.set<CheckoutSession>(redisKey, updatedSession)

    return updatedSession
  } catch (error) {
    console.error('Error updating payment intent:', error)
    return null
  }
}

export async function archiveCheckoutSession(
  session: CheckoutSession,
  orderId: string,
): Promise<void> {
  try {
    // Create archive key using customer email and ID
    const archiveKey = session.steps.email.value
      ? `order_archive:${session.stripeCustomerId}_${session.steps.email.value}`
      : `order_archive:${session.stripeCustomerId}`

    // Store order details
    await redis.set(
      archiveKey,
      {
        orderId,
        session,
        archivedAt: Date.now(),
      },
      {
        ex: ORDER_ARCHIVE_EXPIRY,
      },
    )
  } catch (error) {
    console.error('Error archiving checkout session:', error)
  }
}

export async function handlePaymentSuccess({
  paymentIntentId,
  clientSecret,
}: HandlePaymentSuccessParams): Promise<PaymentSuccessResult> {
  try {
    const payload = await getPayload()
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded' || paymentIntent.client_secret !== clientSecret) {
      throw new Error('Invalid payment intent status or client secret')
    }

    const cartId = paymentIntent.metadata.cartId
    if (!cartId) {
      throw new Error('No cart ID found in payment intent metadata')
    }

    const checkoutSession = await getStoredCheckoutSession({ cartId })

    if (!checkoutSession) {
      return {
        success: false,
        error: 'Checkout session not found',
      }
    }

    if (checkoutSession.status === 'completed') {
      console.warn('checkout session already completed, returning')
      return {
        success: true,
        orderId: checkoutSession.orderId,
      }
    }

    const newOrderNumber = uuidv4()

    const orderData: Omit<Order, 'createdAt' | 'updatedAt' | 'sizes' | 'id'> = {
      status: 'succeeded',
      orderNumber: newOrderNumber.toUpperCase(),
      currency: paymentIntent.currency,
      paymentIntent: paymentIntent as any,
      orderedBy: checkoutSession.customerId,
      shippingRate: {
        displayName: checkoutSession.steps.shipping.method?.name,
        rate: checkoutSession.shippingTotal,
      },
      taxTotal: checkoutSession.taxAmount,
      total: checkoutSession.amount,
      items: checkoutSession.lineItems.map((item) => ({
        product: item.productId,
        isVariant: item.isVariant,
        variant: {
          id: item.variant?.id,
          variantOptions: item.variant?.variantOptions ?? [],
        },
        thumbnailMediaId: item.thumbnailMediaId,
        price: item.price,
        quantity: item.quantity,
        url: `${process.env.NEXT_PUBLIC_URL}/shop/product/${item.productId}`,
      })),
    }

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        ...orderData,
      },
    })

    // update customer to remove cart reference and add stripeCustomerId
    if (checkoutSession.customerId) {
      // remove the cart from the customer
      const customer = await payload.update({
        collection: 'customers',
        id: checkoutSession.customerId,
        data: {
          stripeCustomerID: checkoutSession.stripeCustomerId,
          cart: null,
        },
      })
    }

    // create tax transaction
    const transaction = await stripeClient.tax.transactions.createFromCalculation({
      calculation: checkoutSession.taxCalculationId!,
      reference: paymentIntentId,
      expand: ['line_items'],
    })

    // update the payment intent with the tax transaction id
    await stripeClient.paymentIntents.update(paymentIntentId, {
      metadata: {
        taxTransactionId: transaction.id,
      },
    })

    redis.set(`cart_checkout_session:${cartId}`, {
      ...checkoutSession,
      status: 'completed',
      orderId: order.id,
      taxTransactionId: transaction.id,
    })

    // Archive the checkout session
    await archiveCheckoutSession(checkoutSession, order.id)

    // Trigger post-order processes
    void triggerPostOrderProcesses({
      orderId: order.id,
      email: checkoutSession.customerEmail!,
      cartId,
    })

    return {
      success: true,
      orderId: order.id,
    }
  } catch (error) {
    console.error('Error handling successful payment:', error)
    return {
      success: false,
      error: 'Failed to process order',
    }
  }
}

async function triggerPostOrderProcesses({
  orderId,
  email,
  cartId,
}: {
  orderId: string
  email: string
  cartId: string
}): Promise<void> {
  await deleteCart(cartId)
}

export async function storeHashedPaymentIntent(id: string, clientSecret: string) {
  const hashedId = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id))
  const key = Buffer.from(hashedId).toString('hex').slice(0, 36)
  await redis.set(`payment_intent:${key}`, { id, clientSecret }, { ex: 1000 * 60 * 60 * 24 }) // 1 day expiry
  return key
}

export async function getHashedPaymentIntent(key: string) {
  const value = await redis.get<{ id: string; clientSecret: string }>(`payment_intent:${key}`)
  if (!value) {
    return null
  }
  return value
}
