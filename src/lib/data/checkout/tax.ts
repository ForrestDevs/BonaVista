'use server'

import { stripeClient } from '@/lib/stripe'
import { CheckoutSession } from '@/lib/types/checkout'

export async function calculateTax(session: CheckoutSession) {
  if (!session.steps.shipping.address) {
    console.warn('Cannot calculate tax: missing shipping address')
    return null
  }

  try {
    // Create line items for tax calculation based on checkout line items
    const taxLineItems = session.lineItems.map((item) => ({
      amount: Math.round(item.price * 100), // Ensure price is in cents
      quantity: item.quantity,
      reference: item.sku,
      tax_behavior: 'exclusive' as const, // Type as const to match Stripe's expected type
    }))

    const calculation = await stripeClient.tax.calculations.create({
      currency: session.currencyCode.toLowerCase(),
      line_items: taxLineItems,
      ...(session.stripeCustomerId
        ? {
            customer: session.stripeCustomerId,
          }
        : {
            customer_details: {
              address: {
                line1: session.steps.shipping.address.address.line1,
                line2: session.steps.shipping.address.address.line2 || undefined,
                city: session.steps.shipping.address.address.city,
                state: session.steps.shipping.address.address.state,
                postal_code: session.steps.shipping.address.address.postal_code,
                country: session.steps.shipping.address.address.country,
              },
              address_source: 'shipping',
            },
          }),
      shipping_cost: {
        amount: session.shippingTotal, // Already in cents
        tax_behavior: 'exclusive' as const, // Type as const to match Stripe's expected type
      },
    })

    // Return calculated values in cents
    return {
      calculationId: calculation.id,
      shippingCost: calculation.shipping_cost.amount,
      taxAmount: calculation.tax_amount_exclusive,
      totalAmount: calculation.amount_total,
      taxDate: calculation.tax_date,
    }
  } catch (error) {
    console.error('Error calculating tax:', error)
    // Return a default structure when calculation fails
    return {
      calculationId: undefined,
      shippingCost: session.shippingTotal,
      taxAmount: 0,
      totalAmount: session.subtotal + session.shippingTotal,
      taxDate: new Date().toISOString(),
    }
  }
}
