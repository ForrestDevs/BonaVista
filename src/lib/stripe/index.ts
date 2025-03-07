import Stripe from 'stripe'

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: '2025-02-24.acacia',
})
