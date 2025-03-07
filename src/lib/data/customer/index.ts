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
  billingAddress: PayloadJSON[]
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
        firstName: customer.firstName ?? '',
        lastName: customer.lastName ?? '',
        phone: customer.phone ?? '',
        billingAddress: customer.billing_addresses,
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

/**
 * Finds an existing customer by email or creates a new one for checkout
 * @param email The customer's email address
 * @returns Object containing customer info and login requirement
 */
export async function findOrCreateCheckoutCustomer(email: string) {
  const payload = await getPayload()
  const user = await getCurrentUser()
  const isLoggedIn = !!user

  try {
    // First check if a customer with this email exists
    const { docs: customers } = await payload.find({
      collection: CUSTOMER_SLUG,
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    const customer = customers[0] || null

    // // If customer has an account and user is not logged in, they need to login
    // if (customer?.has_account && !isLoggedIn) {
    //   return {
    //     customer,
    //     needsLogin: true,
    //   }
    // }

    // If no customer exists, create a new one
    if (!customer) {
      const newCustomer = await payload.create({
        collection: CUSTOMER_SLUG,
        data: {
          email: email.toLowerCase(),
          // Link to user if logged in
          account: user?.id || undefined,
          has_account: !!user,
        },
      })

      return {
        customer: newCustomer,
        needsLogin: false,
      }
    }

    // Return existing customer
    return {
      customer,
      needsLogin: false,
    }
  } catch (error) {
    console.error('Error in findOrCreateCheckoutCustomer:', error)
    throw error
  }
}

export async function findCustomerByEmail(email: string) {
  const payload = await getPayload()
  const { docs: customers } = await payload.find({
    collection: CUSTOMER_SLUG,
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
  })

  return customers[0] || null
}

export async function getCachedCustomerById(id: number) {
  const cachedFn = cache(
    async (id: number) => {
      const payload = await getPayload()
      const customer = await payload.findByID({
        collection: CUSTOMER_SLUG,
        id,
      })

      if (!customer) {
        console.error('No customer found')

        return null
      }

      return customer
    },
    {
      tags: [`customer-${id}`],
    },
  )

  return cachedFn(id)
}
