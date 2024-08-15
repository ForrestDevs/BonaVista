import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

const poolProducts = [
  {
    name: 'Chlorine Tablets',
    description: 'Slow-dissolving chlorine tablets for pool sanitization',
    variants: [
      { name: '1 kg', price: 1999 },
      { name: '2 kg', price: 3499 },
      { name: '5 kg', price: 7999 },
    ],
  },
  {
    name: 'pH Plus',
    description: 'Raises pH levels in pool water',
    variants: [
      { name: '500 g', price: 799 },
      { name: '1 kg', price: 1399 },
      { name: '2 kg', price: 2499 },
    ],
  },
  {
    name: 'pH Minus',
    description: 'Lowers pH levels in pool water',
    variants: [
      { name: '500 g', price: 799 },
      { name: '1 kg', price: 1399 },
      { name: '2 kg', price: 2499 },
    ],
  },
  {
    name: 'Algaecide',
    description: 'Prevents and eliminates algae growth',
    variants: [
      { name: '1 L', price: 1299 },
      { name: '2 L', price: 2299 },
      { name: '5 L', price: 4999 },
    ],
  },
  {
    name: 'Pool Shock',
    description: 'Quick-acting chlorine treatment for pool water',
    variants: [
      { name: '500 g', price: 899 },
      { name: '1 kg', price: 1599 },
      { name: '2 kg', price: 2899 },
    ],
  },
  {
    name: 'Stabilizer',
    description: 'Protects chlorine from sunlight degradation',
    variants: [
      { name: '1 kg', price: 1499 },
      { name: '2 kg', price: 2799 },
      { name: '4 kg', price: 4999 },
    ],
  },
  {
    name: 'Pool Salt',
    description: 'For salt water chlorination systems',
    variants: [
      { name: '10 kg', price: 1999 },
      { name: '20 kg', price: 3599 },
      { name: '40 kg', price: 6499 },
    ],
  },
  {
    name: 'Clarifier',
    description: 'Improves water clarity by clumping particles',
    variants: [
      { name: '1 L', price: 999 },
      { name: '2 L', price: 1799 },
      { name: '5 L', price: 3999 },
    ],
  },
  {
    name: 'Phosphate Remover',
    description: 'Eliminates phosphates to prevent algae growth',
    variants: [
      { name: '1 L', price: 1599 },
      { name: '2 L', price: 2899 },
      { name: '5 L', price: 6499 },
    ],
  },
  {
    name: 'Pool Filter Cleaner',
    description: 'Removes oils and debris from pool filters',
    variants: [
      { name: '1 L', price: 1199 },
      { name: '2 L', price: 2199 },
      { name: '5 L', price: 4799 },
    ],
  },
  {
    name: 'Pool Surface Cleaner',
    description: 'Removes stains and scale from pool surfaces',
    variants: [
      { name: '1 L', price: 1399 },
      { name: '2 L', price: 2599 },
      { name: '5 L', price: 5799 },
    ],
  },
  {
    name: 'Pool Test Strips',
    description: 'For testing pool water chemistry',
    variants: [
      { name: '50 strips', price: 899 },
      { name: '100 strips', price: 1599 },
      { name: '200 strips', price: 2799 },
    ],
  },
  {
    name: 'Pool Brush',
    description: 'For scrubbing pool walls and floor',
    variants: [
      { name: '18 inch', price: 1499 },
      { name: '24 inch', price: 1999 },
      { name: '36 inch', price: 2499 },
    ],
  },
  {
    name: 'Pool Skimmer Net',
    description: 'For removing debris from pool surface',
    variants: [
      { name: 'Standard', price: 999 },
      { name: 'Deep Bag', price: 1499 },
      { name: 'Extra Wide', price: 1799 },
    ],
  },
  {
    name: 'Pool Vacuum Head',
    description: 'For manual pool cleaning',
    variants: [
      { name: '14 inch', price: 2499 },
      { name: '18 inch', price: 2999 },
      { name: '22 inch', price: 3499 },
    ],
  },
  {
    name: 'Pool Cover',
    description: 'Protects pool from debris and heat loss',
    variants: [
      { name: '12 ft x 24 ft', price: 7999 },
      { name: '16 ft x 32 ft', price: 9999 },
      { name: '20 ft x 40 ft', price: 12999 },
    ],
  },
  {
    name: 'Pool Thermometer',
    description: 'For measuring pool water temperature',
    variants: [
      { name: 'Basic', price: 599 },
      { name: 'Digital', price: 1299 },
      { name: 'Wireless', price: 2499 },
    ],
  },
  {
    name: 'Pool Ladder',
    description: 'For easy entry and exit from the pool',
    variants: [
      { name: '3 Step', price: 9999 },
      { name: '4 Step', price: 12999 },
      { name: '5 Step', price: 15999 },
    ],
  },
  {
    name: 'Pool Light',
    description: 'Underwater lighting for pools',
    variants: [
      { name: 'LED 12W', price: 5999 },
      { name: 'LED 20W', price: 7999 },
      { name: 'LED 35W', price: 9999 },
    ],
  },
  {
    name: 'Pool Heater',
    description: 'For maintaining comfortable water temperature',
    variants: [
      { name: '55,000 BTU', price: 99999 },
      { name: '100,000 BTU', price: 149999 },
      { name: '150,000 BTU', price: 199999 },
    ],
  },
]

export async function GET() {
  try {
    const products = await Promise.all(
      poolProducts.map(async (product) => {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description,
        })

        const prices = await Promise.all(
          product.variants.map(async (variant) => {
            return await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: variant.price,
              currency: 'usd',
              nickname: variant.name,
            })
          }),
        )

        return { product: stripeProduct, prices }
      }),
    )

    return NextResponse.json({ success: true, products }, { status: 200 })
  } catch (error) {
    console.error('Error seeding products:', error)
    return NextResponse.json({ success: false, error: 'Failed to seed products' }, { status: 500 })
  }
}
