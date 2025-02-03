'use server'

import Stripe from 'stripe'
import getPayload from '@lib/utils/getPayload'
import { stripeClient } from '@/lib/stripe'

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

export async function getAvailableShippingMethods() {
  const payload = await getPayload()
  const shopSettings = await payload.findGlobal({
    slug: 'shop-settings',
  })

  if (!shopSettings || !shopSettings.shippingMethods) {
    throw new Error('Shipping methods not found in shop settings')
  }

  return shopSettings.shippingMethods.filter((method) => method.enabled)
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

export async function createPaymentIntent() {
  console.log('creating payment intent')

  try {
    const paymentIntent = await stripeClient.paymentIntents.create({
      currency: 'CAD',
      amount: 1000,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('error creating payment intent', error)
  }
}

export async function updatePaymentIntent(
  paymentIntentId: string,
  data: Stripe.PaymentIntentUpdateParams,
) {
  console.log('updating payment intent', paymentIntentId)

  try {
    const paymentIntent = await stripeClient.paymentIntents.update(paymentIntentId, data)
    return paymentIntent
  } catch (error) {
    console.error('error updating payment intent', error)
  }
}
