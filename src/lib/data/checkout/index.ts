'use server'

import { redis } from '@/lib/redis/client'
import { getCartCookie } from '@/lib/data/cookies'
import { createPaymentIntent } from '@/lib/data/shop'
import { redirect } from 'next/navigation'
import {
  BeginCheckoutParams,
  CheckoutSession,
  CreateStoredCheckoutSessionParams,
} from '@/lib/types/checkout'

export async function getStoredCheckoutSession(
  redirectTo?: string,
): Promise<CheckoutSession | null> {
  const cartCookie = await getCartCookie()

  if (!cartCookie?.id) {
    console.error('No cart found')
    if (redirectTo) {
      redirect(redirectTo)
    }

    return null
  }

  console.log('cartCookie', cartCookie)

  const cartId = cartCookie.id
  const redisKey = `cart_checkout_session:${cartId}`

  const checkoutSession = await redis.get<CheckoutSession>(redisKey)

  if (!checkoutSession) {
    console.error('No checkout session found')
    if (redirectTo) {
      redirect(redirectTo)
    }
    return null
  }
  console.log('checkoutSession from redis', checkoutSession.cartId)

  return checkoutSession
}

export async function createStoredCheckoutSession(
  props: CreateStoredCheckoutSessionParams,
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
    shippingMethod,
    shippingTotal,
    taxAmount,
  } = props

  try {
    console.log('creating payment intent')

    const amountInCents = amount * 100

    const paymentIntent = await createPaymentIntent({
      amount: amountInCents,
      currencyCode,
      description,
      stripeCustomerId,
      metadata,
      cartId,
    })

    console.log('payment intent created')

    const newCheckoutSession: CheckoutSession = {
      cartId,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      currencyCode,
      description,
      lineItems,
      stripeCustomerId,
      customerEmail,
      customerId,
      shippingMethod,
      shippingTotal,
      taxAmount,
    }
    console.log('new checkout session created')

    const redisKey = `cart_checkout_session:${cartId}`
    await redis.set<CheckoutSession>(redisKey, newCheckoutSession)
    console.log('new checkout session set in redis')
    return newCheckoutSession
  } catch (error) {
    console.error('Error creating checkout session', error)
    return null
  }
}

export async function beginCheckoutSession(props: BeginCheckoutParams): Promise<void | null> {
  const {
    amount,
    currencyCode,
    description,
    customerId,
    metadata,
    cartId,
    redirectTo,
    lineItems,
    customerEmail,
    stripeCustomerId,
    shippingMethod,
    shippingTotal,
    taxAmount,
  } = props

  // check for existing checkout session
  const checkoutSession = await getStoredCheckoutSession()

  // if checkout session exists, redirect to checkout
  if (checkoutSession) {
    console.log('checkout session exists', checkoutSession)
    redirect(redirectTo)
  } else {
    console.log('no checkout session exists, creating new one')
    // create new checkout session
    const newCheckoutSession = await createStoredCheckoutSession({
      amount,
      currencyCode,
      description,
      cartId,
      lineItems,
      stripeCustomerId,
      customerEmail,
      customerId,
      shippingMethod,
      shippingTotal,
      taxAmount,
      metadata,
    })

    // if checkout session creation fails, dont redirect and fail silently
    if (!newCheckoutSession) {
      console.error('Error creating checkout session')
      return null
    }

    console.log('new checkout session created', newCheckoutSession)
    // redirect to checkout
    redirect(redirectTo)
  }
}
