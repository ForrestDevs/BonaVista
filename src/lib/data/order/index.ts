'use server'

import getPayload from '@/lib/utils/getPayload'
import { Order } from '@payload-types'
import { ORDER_SLUG } from '@/payload/collections/constants'
import { getCurrentUser } from '@/lib/data/auth'
import { cache } from '@/lib/utils/cache'
import { createHash } from 'crypto'
import { sendPickupReadyEmail, sendShippingConfirmationEmail } from '@/lib/data/email'

/**
 * Get all orders for the currently authenticated user
 * @returns Array of user orders or null if no user is authenticated
 */
export async function getCurrentUserOrders() {
  const user = await getCurrentUser()
  const cacheFn = cache(
    async (): Promise<Order[] | null> => {
      if (!user || !user.customer) {
        return null
      }

      const customerId = typeof user.customer === 'object' ? user.customer.id : user.customer

      const payload = await getPayload()
      try {
        const { docs } = await payload.find({
          collection: ORDER_SLUG,
          where: {
            orderedBy: {
              equals: customerId,
            },
          },
          sort: '-createdAt',
        })

        return docs as Order[]
      } catch (error) {
        console.error('Error fetching user orders:', error)
        return []
      }
    },
    {
      tags: ['orders'],
    },
  )
  return await cacheFn()
}

/**
 * Get a specific order by ID and verify ownership if a user is logged in
 * @param orderId The ID of the order to retrieve
 * @returns The order if found and authorized, or null
 */
export async function getOrderByIdWithAuth(orderId: string): Promise<{
  order: Order | null
  isOwnedByUser: boolean
}> {
  const payload = await getPayload()
  const user = await getCurrentUser()

  try {
    const order = (await payload.findByID({
      collection: ORDER_SLUG,
      id: orderId,
    })) as Order | null

    if (!order) {
      return { order: null, isOwnedByUser: false }
    }

    // If user is logged in, check if they own this order
    if (user && user.customer) {
      const customerId = typeof user.customer === 'object' ? user.customer.id : user.customer
      const isOwnedByUser = order.orderedBy === customerId

      return {
        order,
        isOwnedByUser,
      }
    }

    // Not authenticated, but order exists
    return {
      order,
      isOwnedByUser: false,
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    return {
      order: null,
      isOwnedByUser: false,
    }
  }
}

/**
 * Generate a secure hash for order authentication
 * @param orderId The order ID
 * @param orderNumber The order number
 * @returns A secure hash string for authentication
 */
export async function generateOrderAuthHash(orderId: string, orderNumber: string): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET || 'order-secret'
  return createHash('sha256').update(`${orderId}-${orderNumber}-${secret}`).digest('hex')
}

/**
 * Verify if an auth hash is valid for a given order
 * @param orderId The order ID
 * @param orderNumber The order number
 * @param authHash The auth hash to verify
 * @returns Boolean indicating if the hash is valid
 */
export async function verifyOrderAuthHash(
  orderId: string,
  orderNumber: string,
  authHash: string,
): Promise<boolean> {
  const expectedHash = await generateOrderAuthHash(orderId, orderNumber)
  return authHash === expectedHash
}

/**
 * Get an order by ID with authentication using a hash
 * @param orderId The order ID
 * @param authHash The authentication hash to verify
 * @returns The order if found and authenticated, or null
 */
export async function getOrderByIdWithHashAuth(
  orderId: string,
  authHash: string,
): Promise<Order | null> {
  const { order, isOwnedByUser } = await getOrderByIdWithAuth(orderId)

  // If user owns the order, they're already authenticated
  if (isOwnedByUser) {
    return order
  }

  // No order found
  if (!order) {
    return null
  }

  // Verify the auth hash
  const orderNumber = order.orderNumber || order.id.toString().slice(0, 8)
  if (verifyOrderAuthHash(orderId, orderNumber, authHash)) {
    return order
  }

  // Auth hash invalid
  return null
}

/**
 * Verify an order using email and order number
 * @param email The email associated with the order
 * @param orderNumber The order number
 * @returns The order if found and verified, or null
 */
export async function verifyOrderByEmailAndNumber(
  email: string,
  orderNumber: string,
): Promise<{
  order: Order | null
  authHash?: string
}> {
  const payload = await getPayload()

  try {
    const { docs } = await payload.find({
      collection: ORDER_SLUG,
      where: {
        and: [
          {
            orderNumber: {
              equals: orderNumber,
            },
          },
          {
            email: {
              equals: email.toLowerCase(),
            },
          },
        ],
      },
      limit: 1,
    })

    if (docs.length === 0) {
      return { order: null }
    }

    const order = docs[0] as Order
    const authHash = await generateOrderAuthHash(order.id.toString(), orderNumber)

    return {
      order,
      authHash,
    }
  } catch (error) {
    console.error('Error verifying order:', error)
    return { order: null }
  }
}

export async function getCachedOrderById(orderId: number): Promise<Order | null> {
  const cachedFn = cache(
    async (orderId: number) => {
      const payload = await getPayload()
      const order = await payload.findByID({
        collection: ORDER_SLUG,
        id: orderId,
      })

      if (!order) {
        return null
      }

      return order
    },
    {
      tags: [`order-${orderId}`],
    },
  )

  return cachedFn(orderId)
}

/**
 * Marks an order as ready for pickup and sends a notification email to the customer
 */
export async function markOrderReadyForPickup(
  orderId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const payload = await getPayload()

    // Update order status to indicate it's ready for pickup
    await payload.update({
      collection: ORDER_SLUG,
      id: orderId,
      data: {
        status: 'ready_for_pickup',
      },
    })

    // Send pickup ready email to the customer
    try {
      const emailSent = await sendPickupReadyEmail(orderId)
      if (!emailSent) {
        console.error(`Failed to send pickup ready email for order ${orderId}`)
      }
    } catch (error) {
      console.error('Error sending pickup ready email:', error)
    }

    return {
      success: true,
      message: 'Order marked as ready for pickup and customer notified',
    }
  } catch (error) {
    console.error('Error marking order as ready for pickup:', error)
    return {
      success: false,
      message: 'Failed to mark order as ready for pickup',
    }
  }
}

interface MarkOrderShippedParams {
  orderId: number
  trackingNumber: string
  trackingUrl: string
  carrier?: string
}

/**
 * Marks an order as shipped and sends a shipping confirmation email to the customer
 */
export async function markOrderShipped({
  orderId,
}: MarkOrderShippedParams): Promise<{ success: boolean; message: string }> {
  try {
    const payload = await getPayload()

    // Update order status to indicate it's shipped
    await payload.update({
      collection: ORDER_SLUG,
      id: orderId,
      data: {
        status: 'shipped',
      },
    })

    // Send shipping confirmation email to the customer
    try {
      const emailSent = await sendShippingConfirmationEmail(orderId)
      if (!emailSent) {
        console.error(`Failed to send shipping confirmation email for order ${orderId}`)
      }
    } catch (error) {
      console.error('Error sending shipping confirmation email:', error)
    }

    return {
      success: true,
      message: 'Order marked as shipped and customer notified',
    }
  } catch (error) {
    console.error('Error marking order as shipped:', error)
    return {
      success: false,
      message: 'Failed to mark order as shipped',
    }
  }
}
