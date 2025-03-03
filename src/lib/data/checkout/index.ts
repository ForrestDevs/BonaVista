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
  UpdateCheckoutSessionParams,
  CheckoutLineItem,
} from '@/lib/types/checkout'
import { CART_SLUG } from '@/payload/collections/constants'
import { deleteCart } from '../cart'
import { Order } from '@payload-types'

const CHECKOUT_SESSION_EXPIRY = 1000 * 60 * 30 // 30 minutes
const ORDER_ARCHIVE_EXPIRY = 1000 * 60 * 60 * 24 * 30 // 30 days

interface GetStoredCheckoutSessionParams {
  cartId?: number
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
    const totalAmountInCents = amount + shippingTotal + taxAmount

    const paymentIntent = await createPaymentIntent({
      amount: totalAmountInCents, // Pass total amount in cents
      currencyCode,
      description,
      stripeCustomerId,
      metadata: {
        ...metadata,
        cartId: cartId.toString(),
        sessionId: uuidv4(),
      },
      cartId: cartId.toString(),
    })

    if (!paymentIntent) {
      throw new Error('Failed to create payment intent')
    }

    const newCheckoutSession: CheckoutSession = {
      id: uuidv4(),
      status: 'pending',
      cartId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      subtotal: amount,
      shippingTotal: shippingTotal,
      taxAmount: taxAmount,
      amount: totalAmountInCents,
      currencyCode,
      description,
      lineItems,
      stripeCustomerId,
      customerEmail,
      customerId,
      steps: {
        email: {
          completed: Boolean(customerEmail) || false,
          value: customerEmail ?? undefined,
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
  console.log('beginning new checkout session for cart', sessionProps.cartId)

  // Check for existing checkout session
  const checkoutSession = await getStoredCheckoutSession({ cartId: sessionProps.cartId })

  // Calculate initial subtotal from line items
  const initialSubtotal = Math.round(
    sessionProps.lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
  )

  // If checkout session exists, check if line items have changed
  if (checkoutSession) {
    console.log('checkout session found')

    // Check if line items have changed by comparing them
    const lineItemsChanged = checkoutSessionLineItemsChanged(
      checkoutSession.lineItems,
      sessionProps.lineItems,
    )

    if (lineItemsChanged) {
      console.log('line items have changed, updating checkout session')

      // Update the checkout session with new line items and recalculated subtotal
      const updatedSession = await updateCheckoutSession({
        cartId: sessionProps.cartId,
        lineItems: sessionProps.lineItems,
        amount: initialSubtotal, // Using amount instead of subtotal to match the interface
        taxAmount: 0,
        shippingTotal: 0,
        // Keep the amount as the sum of components
        // This will get recalculated in updateCheckoutSession
      })

      if (!updatedSession) {
        console.error('Error updating checkout session with new line items')
        return null
      }

      // Update the payment intent with the new details
      await updatePaymentIntentWithDetails(updatedSession)

      console.log('checkout session updated, redirecting to', redirectTo)
      redirect(redirectTo)
    }

    console.log('no changes to line items, redirecting to', redirectTo)
    redirect(redirectTo)
  }

  console.log('no checkout session found, creating new one')

  // Create new checkout session with zero shipping and tax to start
  const newCheckoutSession = await createStoredCheckoutSession({
    ...sessionProps,
    amount: initialSubtotal, // Initial amount is just the subtotal
    shippingTotal: 0, // No shipping selected yet
    taxAmount: 0, // No tax calculated yet
  })

  if (!newCheckoutSession) {
    console.error('Error creating checkout session')
    return null
  }

  console.log('new checkout session created, redirecting to', redirectTo)
  redirect(redirectTo)
}

// Helper function to check if line items have changed
function checkoutSessionLineItemsChanged(
  existingLineItems: CheckoutLineItem[],
  newLineItems: CheckoutLineItem[],
): boolean {
  // First, create maps for both existing and new items using SKU as key
  const existingItemsMap = new Map(
    existingLineItems.map((item) => [item.sku, { quantity: item.quantity, price: item.price }]),
  )

  const newItemsMap = new Map(
    newLineItems.map((item) => [item.sku, { quantity: item.quantity, price: item.price }]),
  )

  // Check if SKU sets are different
  if (existingItemsMap.size !== newItemsMap.size) {
    return true
  }

  // Check for any SKUs in existing items that don't exist in new items
  for (const [sku, existingItem] of existingItemsMap) {
    const newItem = newItemsMap.get(sku)

    // Item doesn't exist in new items or quantity/price changed
    if (
      !newItem ||
      existingItem.quantity !== newItem.quantity ||
      existingItem.price !== newItem.price
    ) {
      return true
    }
  }

  // Check for any SKUs in new items that don't exist in existing items
  for (const [sku, _] of newItemsMap) {
    if (!existingItemsMap.has(sku)) {
      return true
    }
  }

  return false
}

export async function updateCheckoutSession(
  props: UpdateCheckoutSessionParams,
): Promise<CheckoutSession | null> {
  const { cartId, ...sessionProps } = props
  const redisKey = `cart_checkout_session:${cartId}`
  const session = await redis.get<CheckoutSession>(redisKey)

  if (!session) {
    console.error('Checkout session not found')
    return null
  }

  // Create a deep merge of the session and new props
  // This ensures nested properties like lineItems are properly updated
  const updatedSession: CheckoutSession = {
    ...session,
    ...sessionProps,
    // If lineItems are provided, completely replace them
    lineItems: sessionProps.lineItems || session.lineItems,
    // Update the lastUpdated timestamp
    lastUpdated: Date.now(),
    expiresAt: Date.now() + CHECKOUT_SESSION_EXPIRY,
  }

  // If we're updating monetary values, ensure they're all consistent
  if (
    sessionProps.amount !== undefined ||
    sessionProps.shippingTotal !== undefined ||
    sessionProps.taxAmount !== undefined
  ) {
    // Use new values or fall back to existing ones
    const subtotal = sessionProps.amount !== undefined ? sessionProps.amount : session.amount
    const shippingTotal =
      sessionProps.shippingTotal !== undefined
        ? sessionProps.shippingTotal
        : session.shippingTotal || 0
    const taxAmount =
      sessionProps.taxAmount !== undefined ? sessionProps.taxAmount : session.taxAmount || 0

    // Update the total amount to ensure consistency
    updatedSession.subtotal = subtotal
    updatedSession.amount = subtotal + shippingTotal + taxAmount
    updatedSession.shippingTotal = shippingTotal
    updatedSession.taxAmount = taxAmount
  }

  await redis.set(redisKey, updatedSession)
  return updatedSession
}

export async function updateCheckoutStep<T extends CheckoutStep>({
  cartId,
  step,
  data,
}: UpdateCheckoutStepParams<T>): Promise<CheckoutSession | null> {
  console.log(`[updateCheckoutStep] Updating step ${step} with data:`, data);
  
  const redisKey = `cart_checkout_session:${cartId}`
  const session = await redis.get<CheckoutSession>(redisKey)

  if (!session) {
    console.error('Checkout session not found')
    return null
  }

  // Log previous step states
  console.log(`[updateCheckoutStep] Previous step states:`, {
    email: session.steps.email.completed,
    shipping: session.steps.shipping.completed,
    billing: session.steps.billing.completed,
    payment: session.steps.payment.completed,
  });

  // Preserve completion states of other steps
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

    // Update payment intent - amount is already in cents
    const updatedPaymentIntent = await stripeClient.paymentIntents.update(session.paymentIntentId, {
      amount: session.amount, // Total amount in cents
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
        ...(session.taxCalculationId && { taxCalculationId: session.taxCalculationId }),
        subtotal: session.subtotal.toString(),
        shippingTotal: session.shippingTotal.toString(),
        taxAmount: session.taxAmount.toString(),
      },
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
  orderId: number,
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

    const checkoutSession = await getStoredCheckoutSession({ cartId: parseInt(cartId) })

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
        order: parseInt(checkoutSession.orderId),
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
      lineItems: checkoutSession.lineItems.map((item) => ({
        lineItem: {
          product: item.productId,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          isVariant: item.isVariant,
          variantOptions: item.variantOptions,
          thumbnailMediaId: item.thumbnailMediaId,
          url: item.url,
        },
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
      email: checkoutSession.customerEmail,
      cartId: parseInt(cartId),
    })

    return {
      success: true,
      order,
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
  orderId: number
  email: string
  cartId: number
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
