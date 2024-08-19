import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'
import { Product } from '@payload-types'

const stripe = new Stripe(
  'sk_test_51Pj5HTLgaGitM8WqgcFBxIrPnWkumuWLmhp3M10dQ6P8Ohc7L72nAT7MKQEBAxGYfk3EDe9jPM1zHHUYJxWQNs3S00RdeCyWSG',
  {},
)

const poolProducts: Partial<Product>[] = [
  {
    slug: 'chlorine-tablets',
    title: 'Chlorine Tablets',
    description: '3-inch stabilized chlorine tablets for pool sanitization',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '5 lb bucket',
        description: '5 lb bucket of chlorine tablets',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '25 lb bucket',
        description: '25 lb bucket of chlorine tablets',
        priceJSON: '{"amount": 2699, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'bromine-tablets',
    title: 'Bromine Tablets',
    description: '3-inch stabilized bromine tablets for hot tub sanitization',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '5 lb bucket',
        description: '5 lb bucket of bromine tablets',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '25 lb bucket',
        description: '25 lb bucket of bromine tablets',
        priceJSON: '{"amount": 2699, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'ph-plus',
    title: 'pH Plus',
    description: 'Raises pH levels in pools and spas',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '500 gram bag',
        description: '500 gram bag of pH Plus',
        priceJSON: '{"amount": 799, "currency": "cad"}',
      },
      {
        title: '1 kg bag',
        description: '1 kg bag of pH Plus',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'ph-minus',
    title: 'pH Minus',
    description: 'Lowers pH levels in pools and spas',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '500 gram bag',
        description: '500 gram bag of pH Minus',
        priceJSON: '{"amount": 799, "currency": "cad"}',
      },
      {
        title: '1 kg bag',
        description: '1 kg bag of pH Minus',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'pool-shock',
    title: 'Pool Shock Treatment',
    description: 'Fast-acting chlorine shock treatment',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '1 lb bag',
        description: '1 lb bag of pool shock treatment',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '5 lb bucket',
        description: '5 lb bucket of pool shock treatment',
        priceJSON: '{"amount": 2699, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'algaecide',
    title: 'Algaecide',
    description: 'Prevents and treats algae growth in pools',
    images: [],
    hasVariants: false,
    priceJSON: '{"amount": 1499, "currency": "cad"}',
    _status: 'published',
  },
  {
    slug: 'test-strips',
    title: 'Pool Water Test Strips',
    description: 'Quick and easy way to test pool water chemistry',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '50 strips',
        description: '50 strips of pool water test strips',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '100 strips',
        description: '100 strips of pool water test strips',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'pool-brush',
    title: 'Pool Brush',
    description: 'Durable brush for cleaning pool walls and floor',
    images: [],
    hasVariants: false,
    priceJSON: '{"amount": 1499, "currency": "cad"}',
    _status: 'published',
  },
  {
    slug: 'pool-skimmer',
    title: 'Pool Skimmer Net',
    description: 'Fine mesh net for removing debris from pool surface',
    images: [],
    hasVariants: false,
    priceJSON: '{"amount": 1499, "currency": "cad"}',
    _status: 'published',
  },
  {
    slug: 'pool-filter-sand',
    title: 'Pool Filter Sand',
    description: 'High-quality silica sand for pool sand filters',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '25 lb bag',
        description: '25 lb bag of pool filter sand',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '50 lb bag',
        description: '50 lb bag of pool filter sand',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
  {
    slug: 'hot-tub-defoamer',
    title: 'Hot Tub Defoamer',
    description: 'Eliminates foam in hot tubs and spas',
    images: [],
    hasVariants: false,
    priceJSON: '{"amount": 1499, "currency": "cad"}',
    _status: 'published',
  },
  {
    slug: 'pool-cover',
    title: 'Winter Pool Cover',
    description: 'Durable cover to protect your pool during off-season',
    images: [],
    hasVariants: true,
    variants: [
      {
        title: '15x30 ft',
        description: '15x30 ft pool cover',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
      {
        title: '20x40 ft',
        description: '20x40 ft pool cover',
        priceJSON: '{"amount": 1499, "currency": "cad"}',
      },
    ],
    _status: 'published',
  },
]

const seedProducts = async () => {
  const payload = await getPayload({ config })

  // Delete all Stripe products and prices
//   const stripeProducts = await stripe.products.list({ limit: 100 })
//   for (const product of stripeProducts.data) {
//     const prices = await stripe.prices.list({ product: product.id })
//     for (const price of prices.data) {
//       await stripe.prices.update(price.id, { active: false })
//     }
//     await stripe.products.del(product.id)
//   }
//   console.log('Deleted all Stripe products and prices')

  // Delete all Payload products
  const existingProducts = await payload.find({
    collection: 'products',
    limit: 1000, // Adjust if you have more products
  })

  for (const product of existingProducts.docs) {
    await payload.delete({
      collection: 'products',
      id: product.id,
    })
  }
  console.log('Deleted all Payload products')

  for (const product of poolProducts) {
    // Create product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.title ?? '',
      description: product.description ?? '',
    })

    let stripePriceId = null
    let variants = null

    if (product.hasVariants && product.variants && product.variants.length > 0) {
      variants = await Promise.all(
        product.variants.map(async (variant) => {
          const price = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: JSON.parse(variant.priceJSON ?? '{}').amount,
            currency: JSON.parse(variant.priceJSON ?? '{}').currency,
          })

          return {
            ...variant,
            stripePriceID: price.id,
          }
        }),
      )
    } else {
      // Create a default price for products without variants
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: JSON.parse(product.priceJSON ?? '{}').amount,
        currency: JSON.parse(product.priceJSON ?? '{}').currency,
      })
      stripePriceId = price.id
    }

    // Create product in Payload
    await payload.create({
      collection: 'products',
      data: {
        title: product.title ?? '',
        description: product.description ?? '',
        layout: [
          {
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    tag: 'h3',
                    type: 'heading',
                    version: 1,
                    indent: 0,
                    format: '',
                    direction: 'ltr',
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: product.title ?? '',
                        style: '',
                        mode: 'normal',
                        format: 0,
                        detail: 0,
                      },
                    ],
                  },
                ],
                direction: 'ltr',
                version: 1,
                format: '',
                indent: 0,
              },
            },
            'link-groups': [],
            blockType: 'cta',
          },
        ],
        hasVariants: product.hasVariants,
        variants: variants?.map((variant) => ({
          title: variant.title ?? '',
          description: variant.description ?? '',
          useParentMeta: false,
          stripePriceID: variant.stripePriceID ?? '',
        })),
        stripeProductID: stripeProduct.id,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        _status: product._status,
      },
    })

    console.log(`Created product: ${product.title}`)
  }

  console.log('Product seeding completed')
}

seedProducts()
  .then(() => {
    console.log('Seeding script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error in seeding script:', error)
    process.exit(1)
  })
