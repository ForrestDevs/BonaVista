'use server'

import { actionClient } from '@/lib/actions/client'
import { getAvailableShippingMethods } from '../data/shop'

export const getShippingInfoAction = actionClient
  .metadata({ actionName: 'getShippingInfo' })
  .action(async () => {
    const shippingMethods = await getAvailableShippingMethods()
    return shippingMethods
  })
