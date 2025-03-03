'use server'

import { generateOrderAuthHash, getCachedOrderById } from '../data/order'
import { getCachedCustomerById } from '../data/customer'

interface VerifyOrderResult {
  success: boolean
  orderId?: string
  verificationToken?: string
  error?: string
}

/**
 * Verifies an order by email and order number
 * @param email The email address used for the order
 * @param orderNumber The order number from confirmation email
 * @returns Verification result with a token for authorized access
 */
export async function verifyOrderAction(
  email: string,
  orderNumber: number,
): Promise<VerifyOrderResult> {
  try {
    const order = await getCachedOrderById(orderNumber)
    const customerId = typeof order?.orderedBy === 'number' ? order.orderedBy : order?.orderedBy?.id
    const customer = await getCachedCustomerById(customerId)

    if (!order) {
      return {
        success: false,
        error: 'Order not found. Please check your order number.',
      }
    }

    // Verify the email matches the order's email from the payment intent
    const orderEmail = customer?.email || ''

    // If the order doesn't have an email or it doesn't match
    if (!orderEmail || orderEmail.toLowerCase() !== email.toLowerCase()) {
      return {
        success: false,
        error: 'Email does not match the order. Please check your email address.',
      }
    }

    // Generate verification token
    const orderId = order.id.toString()
    const verificationHash = await generateOrderAuthHash(orderId, order.orderNumber)
    const verificationToken = `${orderId}:${verificationHash}`

    return {
      success: true,
      orderId,
      verificationToken,
    }
  } catch (error) {
    console.error('Error verifying order:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    }
  }
}
