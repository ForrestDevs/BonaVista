import { BRAND_SLUG } from '@/payload/collections/constants'
import getPayload from '../utils/getPayload'

const BRANDS = [
  'Dazzle',
  'Mineraluxe',
  'Pure Wow',
  'Pure + Simple',
  'Pristiva',
  "Jack's Magic",
  'NatChem',
  'Lamotte',
  'Pleatco',
  'Mursatt',
  'Pharma Spa',
  'Inspairations',
  'Dream Scents',
  'Solei',
  'Leader',
  'Ledge',
  'Pool Bean Bag',
  'Canadian Made',
  'Swim Line',
  'Kokido',
  'Pro Aqua',
  'Pentair',
  'Pool Master',
  'Marlig Industries Inc',
  'Zorbie',
  'A&B',
  'Hydropool',
  'Caliber Pumps',
  'Filter Saver',
  'Polaris',
  'Dekko',
]

async function seedBrands() {
  const payload = await getPayload()

  for (const brandName of BRANDS) {
    await payload.create({
      collection: BRAND_SLUG,
      data: {
        name: brandName,
        slug: brandName.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }
}

seedBrands()
  .then(() => {
    console.log('Brands seeded')
  })
  .catch((error) => {
    console.error('Error seeding brands:', error)
  })
