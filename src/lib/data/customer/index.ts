'use server'

import getPayload from '@lib/utils/getPayload'
import { Cart, Customer, User } from '@payload-types'
import { CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCurrentUser } from '../auth'
import { PayloadJSON } from '@/lib/types/payload'
import { cache } from '@/lib/utils/cache'

export const getCustomer = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return getCachedCustomer(user)
}

const getCachedCustomer = cache(
  async (user: User) => {
    const payload = await getPayload()

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
  },
  {
    tags: (user: User) => ['getCustomer', user.id.toString()],
  },
)

export type CustomerDTO = {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  billingAddress: PayloadJSON
  shippingAddresses: PayloadJSON[]
  stripeCustomerId: string
  cart: number | Cart
  metadata: PayloadJSON
}

export async function getCustomerDTO(): Promise<CustomerDTO> | null {
  const user = await getCurrentUser()

  if (!user || !user.customer) {
    return null
  }

  return getCachedCustomerDTO(user)
}

const getCachedCustomerDTO = cache(
  async (user: User) => {
    const payload = await getPayload()

    const customerID = typeof user.customer === 'object' ? user.customer.id : user.customer

    try {
      const customer = await payload.findByID({
        collection: CUSTOMER_SLUG,
        id: customerID,
      })

      if (!customer) {
        return null
      }

      const customerDTO: CustomerDTO = {
        id: customer.id,
        email: user.email,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        billingAddress: customer.billing_address,
        shippingAddresses: customer.shipping_addresses,
        stripeCustomerId: customer.stripeCustomerID ?? '',
        cart: customer.cart,
        metadata: customer.metadata,
      }

      return customerDTO
    } catch (error) {
      console.error(error)
      return null
    }
  },
  {
    tags: (user: User) => ['getCustomerDTO', user.id.toString()],
  },
)
