'use server'

import { render } from '@react-email/components'
import getPayload from '@/lib/utils/getPayload'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { generateOrderAuthHash, getCachedOrderById } from '../order'
import { getCachedCustomerById } from '../customer'
import { OrderConfirmationEmail } from '@/components/email/order-confirmation'
import { AdminOrderNotificationEmail } from '@/components/email/admin-order-notification'
import { ShippingConfirmationEmail } from '@/components/email/shipping-confirmation'
import { PickupReadyEmail } from '@/components/email/pickup-ready'

// const authToken = await generateOrderAuthHash(order.id.toString(), order.orderNumber)
interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Base email sender function that uses Payload's sendEmail method
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const payload = await getPayload()

    await payload.sendEmail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.text && { text: options.text }),
    })

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderId: number): Promise<boolean> {
  try {
    const order = await getCachedOrderById(orderId)
    if (!order) throw new Error(`Order not found with ID: ${orderId}`)

    const customer =
      typeof order.orderedBy === 'object'
        ? order.orderedBy
        : await getCachedCustomerById(order.orderedBy)

    if (!customer) throw new Error(`Customer not found for order: ${orderId}`)

    const customerEmail = customer.email
    const authToken = await generateOrderAuthHash(order.id.toString(), order.orderNumber)

    const emailHtml = await render(
      <OrderConfirmationEmail authToken={authToken} order={order} customer={customer} />,
    )

    return sendEmail({
      to: customerEmail,
      subject: `Thank you for your order #${order.id}`,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return false
  }
}

/**
 * Send order notification email to admin
 */
export async function sendOrderNotificationToAdmin(orderId: number): Promise<boolean> {
  try {
    const order = await getCachedOrderById(orderId)
    if (!order) throw new Error(`Order not found with ID: ${orderId}`)

    const settings = await getCachedGlobal('site-settings')
    if (!settings || !settings.admin?.email) {
      throw new Error('Admin email not configured in site settings')
    }

    const adminEmail = settings.admin.email
    const customer =
      typeof order.orderedBy === 'object'
        ? order.orderedBy
        : await getCachedCustomerById(order.orderedBy)

    if (!customer) throw new Error(`Customer not found for order: ${orderId}`)

    const emailHtml = await render(
      <AdminOrderNotificationEmail order={order} customer={customer} />,
    )

    return sendEmail({
      to: "luke.gannon@me.com",
      subject: `New Order #${order.orderNumber} Received`,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending admin order notification email:', error)
    return false
  }
}

/**
 * Send pickup ready notification to customer
 */
export async function sendPickupReadyEmail(orderId: number): Promise<boolean> {
  try {
    const order = await getCachedOrderById(orderId)
    if (!order) throw new Error(`Order not found with ID: ${orderId}`)

    // Only send for pickup orders
    const isPickup = order.deliveryType === 'pickup'
    if (!isPickup) {
      console.log(`Order ${orderId} is not a pickup order, skipping pickup ready email`)
      return false
    }

    const customer =
      typeof order.orderedBy === 'object'
        ? order.orderedBy
        : await getCachedCustomerById(order.orderedBy)

    if (!customer) throw new Error(`Customer not found for order: ${orderId}`)

    const customerEmail = customer.email

    const emailHtml = await render(<PickupReadyEmail order={order} customer={customer} />)

    return sendEmail({
      to: customerEmail,
      subject: `Your order #${order.orderNumber} is ready for pickup`,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending pickup ready email:', error)
    return false
  }
}

/**
 * Send shipping confirmation email to customer
 */
export async function sendShippingConfirmationEmail(orderId: number): Promise<boolean> {
  try {
    const order = await getCachedOrderById(orderId)
    if (!order) throw new Error(`Order not found with ID: ${orderId}`)

    // Only send for shipping orders
    const isPickup = order.deliveryType === 'pickup'
    if (isPickup) {
      console.log(`Order ${orderId} is a pickup order, skipping shipping confirmation email`)
      return false
    }

    const customer =
      typeof order.orderedBy === 'object'
        ? order.orderedBy
        : await getCachedCustomerById(order.orderedBy)

    if (!customer) throw new Error(`Customer not found for order: ${orderId}`)

    const customerEmail = customer.email
    const authToken = await generateOrderAuthHash(order.id.toString(), order.orderNumber)
    const emailHtml = await render(
      <ShippingConfirmationEmail order={order} customer={customer} authToken={authToken} />,
    )

    return sendEmail({
      to: customerEmail,
      subject: `Your order #${order.orderNumber} has shipped`,
      html: emailHtml,
    })
  } catch (error) {
    console.error('Error sending shipping confirmation email:', error)
    return false
  }
}

/**
 * Process emails for a new order
 * - Sends confirmation to customer
 * - Sends notification to admin
 */
export async function processOrderEmails(orderId: number): Promise<void> {
  try {
    // Send customer confirmation email
    const customerEmailSent = await sendOrderConfirmationEmail(orderId)
    if (!customerEmailSent) {
      console.error(`Failed to send customer confirmation email for order ${orderId}`)
    }

    // Send admin notification email
    const adminEmailSent = await sendOrderNotificationToAdmin(orderId)
    if (!adminEmailSent) {
      console.error(`Failed to send admin notification email for order ${orderId}`)
    }
  } catch (error) {
    console.error('Error processing order emails:', error)
  }
}
