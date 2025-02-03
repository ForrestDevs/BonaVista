import Stripe from 'stripe'

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: '2024-12-18.acacia',
})
