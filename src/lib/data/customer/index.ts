'use server'

import getPayload from '@lib/utils/getPayload'
import { Cart, Customer } from '@payload-types'
import { CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCurrentUser } from '../auth'
import { PayloadJSON } from '@/lib/types/payload'

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

export type CustomerDTO = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  billingAddress: PayloadJSON
  shippingAddresses: PayloadJSON[]
  stripeCustomerId: string
  cart: string | Cart
  metadata: PayloadJSON
}

export async function getCustomerDTO(): Promise<CustomerDTO> | null {
  const payload = await getPayload()
  const user = await getCurrentUser()

  if (!user || !user.customer) {
    return null
  }

  const customerID = typeof user.customer === 'string' ? user.customer : user.customer.id

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
}
