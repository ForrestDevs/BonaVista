'use server'

import getPayload from '@lib/utils/getPayload'

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
