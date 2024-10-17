'use server'

import getPayload from '@lib/utils/getPayload'
import { Customer } from '@payload-types'
import { CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCurrentUser } from '../auth'

export async function getCustomer(): Promise<Customer | null> {
  const payload = await getPayload()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const { docs } = await payload.find({
      collection: CUSTOMER_SLUG,
      where: {
        account: {
          equals: user.id,
        },
      },
    })

    if (docs.length === 0) {
      return null
    }

    return docs[0]
  } catch (error) {
    console.error(error)
    return null
  }
}
