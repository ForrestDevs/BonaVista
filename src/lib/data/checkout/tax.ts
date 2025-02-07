'use server'

import { stripeClient } from '@/lib/stripe'
import { CheckoutSession } from '@/lib/types/checkout'

export async function calculateTax(session: CheckoutSession) {
  if (!session.steps.shipping.address) {
    return null
  }

  try {
    const calculation = await stripeClient.tax.calculations.create({
      currency: session.currencyCode.toLowerCase(),
      line_items: session.lineItems.map((item) => ({
        amount: Math.round(item.price * 100),
        quantity: item.quantity,
        reference: item.id,
      })),
      customer: session.stripeCustomerId || undefined,
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
      shipping_cost: {
        amount: Math.round(session.shippingTotal * 100),
        tax_behavior: 'inclusive', // Stripe will add the tax to the shipping cost
      },
    })

    return {
      calculationId: calculation.id,
      shippingCost: calculation.shipping_cost.amount / 100,
      taxAmount: calculation.tax_amount_exclusive / 100,
      newTotal: calculation.amount_total / 100,
      taxDate: calculation.tax_date,
    }
  } catch (error) {
    console.error('Error calculating tax:', error)
    return null
  }
}
