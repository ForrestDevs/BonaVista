'use server'

import Stripe from 'stripe'
import getPayload from '@lib/utils/getPayload'
import { stripeClient } from '@/lib/stripe'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { ShippingOption, ShopSetting } from '@payload-types'
import { getCachedDocuments } from '@/lib/utils/getDocument'
import { SHIPPING_OPTION_SLUG } from '@/payload/collections/constants'

export async function getAvailablePaymentMethods() {
  const payload = await getPayload()
  const shopSettings = await payload.findGlobal({
    slug: 'shop-settings',
  })

  if (!shopSettings || !shopSettings.paymentMethods) {
    throw new Error('Payment methods not found in shop settings')
  }

  return shopSettings.paymentMethods.filter((method) => method.enabled)
}

export async function getAvailableShippingMethods(): Promise<ShippingOption[] | null> {
  const shippingOptions = await getCachedDocuments({
    collection: SHIPPING_OPTION_SLUG,
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  if (!shippingOptions) {
    console.error('Shipping methods not found')
    return null
  }

  return shippingOptions
}

function addTagPrefix(tags: string[], prefix: string) {
  if (!tags || !prefix) {
    return tags
  }

  return [...tags, `prefix-${prefix}`, ...tags.map((tag) => `${prefix}-${tag}`)]
}

export async function getStripeClient({
  tags,
  revalidate,
  cache,
  tagPrefix,
  secretKey,
}: {
  tags: string[]
  revalidate: number
  cache: RequestCache
  tagPrefix: string
  secretKey: string
}) {
  const privateKey = secretKey ?? process.env.STRIPE_SECRET_KEY
  if (!privateKey) {
    throw new Error('Missing `secretKey` parameter and `STRIPE_SECRET_KEY` env variable.')
  }

  const tagsWithPrefix = addTagPrefix(tags, tagPrefix)

  const stripeClient = new Stripe(privateKey, {
    typescript: true,
    apiVersion: '2024-12-18.acacia',
    httpClient: Stripe.createFetchHttpClient((fetch, options) =>
      fetch(fetch, {
        ...options,
        cache: cache ?? options?.cache,
        next: {
          tags: tagsWithPrefix ?? options?.next?.tags,
          revalidate: revalidate ?? options?.next?.revalidate,
        },
      }),
    ),
    appInfo: {
      name: 'BonaVista LeisureScapes Payment SDK',
      version: '1.0.0',
      url: 'https://bonavistaleisurescapes.com',
      partner_id: 'fdev45',
    },
  })

  return stripeClient
}

type CreatePaymentIntentParams = {
  /**
   * Amount intended to be collected by this PaymentIntent.
   * A positive integer representing how much to charge in the smallest currency unit
   * (e.g., 100 cents to charge $1.00 or 100 to charge ¥100, a zero-decimal currency).
   * The minimum amount is $0.50 US or equivalent in charge currency.
   * The amount value supports up to eight digits (e.g., a value of 99999999 for a USD charge of $999,999.99).
   */
  amount: number

  /**
   * The currency of the payment intent.
   */
  currencyCode: string

  /**
   * The cart id of the payment intent. Used as the idempotency key.
   */
  cartId: string

  /**
   * An arbitrary string attached to the object. Often useful for displaying to users.
   */
  description?: string

  /**
   * The stripe customer id of the payment intent.
   */
  stripeCustomerId?: string

  /**
   * Set of key-value pairs that you can attach to an object.
   * This can be useful for storing additional information about the object in a structured format.
   */
  metadata?: Record<string, string>
}

export async function createPaymentIntent({
  amount,
  currencyCode,
  cartId,
  description,
  stripeCustomerId,
  metadata,
}: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripeClient.paymentIntents.create(
      {
        amount: amount,
        currency: currencyCode,
        description: description,
        customer: stripeCustomerId,
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        idempotencyKey: cartId,
      },
    )

    return paymentIntent
  } catch (error) {
    console.error('error creating payment intent', error)
    return null
  }
}

type UpdatePaymentIntentParams = {
  /**
   * The payment intent id to update.
   */
  paymentIntentId: string

  /**
   * The data to update the payment intent with.
   */
  data: Stripe.PaymentIntentUpdateParams
}

export async function updatePaymentIntent({
  paymentIntentId,
  data,
}: UpdatePaymentIntentParams): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripeClient.paymentIntents.update(paymentIntentId, data)
    return paymentIntent
  } catch (error) {
    console.error('error updating payment intent', error)
    return null
  }
}
