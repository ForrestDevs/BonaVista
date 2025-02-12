import getPayload from '../utils/getPayload'
import { PRODUCT_CATEGORY_SLUG } from '@/payload/collections/constants'

const seedProductCategories = async () => {
  const payload = await getPayload()

  // Helper function to create category
  const createCategory = async (title: string, description: string, parentId?: number) => {
    try {
      return await payload.create({
        collection: PRODUCT_CATEGORY_SLUG,
        data: {
          title,
          description,
          ...(parentId && { parent: parentId }),
        },
      })
    } catch (error) {
      console.error(`Failed to create category: ${title}`, error)
      throw error
    }
  }

  try {
    // Create top-level categories
    const waterCare = await createCategory(
      'Water Care',
      'Complete water care solutions for your pool, spa, or hot tub. Keep your water clean, balanced, and safe.',
    )

    const filters = await createCategory(
      'Filters',
      'High-quality replacement filters for all your water care needs.',
    )

    const parts = await createCategory(
      'Parts',
      'Genuine replacement parts and components to keep your equipment running smoothly.',
    )

    const accessories = await createCategory(
      'Accessories',
      'Enhance your water experience with our range of accessories and equipment.',
    )

    const aquaFitness = await createCategory(
      'Aqua Fitness',
      'Equipment and accessories for water-based exercise and fitness routines.',
    )

    const swimwear = await createCategory(
      'Swimwear',
      'Quality swimwear and water-friendly attire for all ages.',
    )

    const fragrances = await createCategory(
      'Fragrances',
      'Aromatic solutions to enhance your water experience.',
    )

    const outdoorLiving = await createCategory(
      'Outdoor Living',
      'Transform your outdoor space with our selection of furniture and features.',
    )

    // Water Care subcategories
    const swimSpaCare = await createCategory(
      'Swim Spa Care',
      'Specialized water care products for swim spa maintenance.',
      waterCare.id,
    )

    const hotTubCare = await createCategory(
      'Hot Tub Care',
      'Complete water care solutions for your hot tub.',
      waterCare.id,
    )

    const poolCare = await createCategory(
      'Pool Care',
      'Professional-grade pool maintenance products.',
      waterCare.id,
    )

    // Swim Spa Care subcategories
    await createCategory(
      'Swim Spa Kits',
      'All-in-one water care kits for swim spa maintenance.',
      swimSpaCare.id,
    )
    await createCategory(
      'Swim Spa Balancers',
      'Water balancers for optimal swim spa water chemistry.',
      swimSpaCare.id,
    )
    await createCategory(
      'Swim Spa Sanitizers',
      'Sanitizing solutions for swim spa water safety.',
      swimSpaCare.id,
    )
    await createCategory(
      'Swim Spa Maintenance',
      'Regular maintenance products for swim spas.',
      swimSpaCare.id,
    )

    // Hot Tub Care subcategories
    await createCategory(
      'Hot Tub Kits',
      'Complete water care kits for hot tub maintenance.',
      hotTubCare.id,
    )
    await createCategory(
      'Hot Tub Balancers',
      'Water balancers for optimal hot tub water chemistry.',
      hotTubCare.id,
    )
    await createCategory(
      'Hot Tub Sanitizers',
      'Sanitizing products for hot tub water safety.',
      hotTubCare.id,
    )
    await createCategory(
      'Hot Tub Maintenance',
      'Essential maintenance products for hot tubs.',
      hotTubCare.id,
    )
    // Pool Care subcategories
    await createCategory('Pool Kits', 'Comprehensive pool care kits.', poolCare.id)
    await createCategory(
      'Pool Salts',
      'Salt products for chlorine generators and salt water pools.',
      poolCare.id,
    )
    await createCategory(
      'Pool Balancers',
      'Water balancers for optimal pool water chemistry.',
      poolCare.id,
    )
    await createCategory(
      'Pool Sanitizers',
      'Pool sanitizing and disinfection products.',
      poolCare.id,
    )
    await createCategory('Pool Maintenance', 'Regular pool maintenance products.', poolCare.id)
    await createCategory(
      'Pool Algaecides',
      'Algae prevention and treatment solutions.',
      poolCare.id,
    )
    // Filters subcategories
    await createCategory('Swim Spa Filters', 'Replacement filters for swim spas.', filters.id)
    await createCategory('Hot Tub Filters', 'Replacement filters for hot tubs.', filters.id)
    await createCategory('Pool Filters', 'Replacement filters for pools.', filters.id)

    // Parts subcategories
    await createCategory('Swim Spa Parts', 'Replacement parts for swim spas.', parts.id)
    await createCategory('Hot Tub Parts', 'Replacement parts for hot tubs.', parts.id)
    await createCategory(
      'Pool Winterization',
      'Products and equipment for pool winterizing.',
      parts.id,
    )

    // Accessories subcategories
    const swimSpaAccessories = await createCategory(
      'Swim Spa Accessories',
      'Enhance your swim spa experience with our accessories.',
      accessories.id,
    )

    const hotTubAccessories = await createCategory(
      'Hot Tub Accessories',
      'Accessories to improve your hot tub experience.',
      accessories.id,
    )

    const poolAccessories = await createCategory(
      'Pool Accessories',
      'Essential and fun accessories for your pool.',
      accessories.id,
    )

    // Pool Accessories subcategories
    await createCategory(
      'Pool Tools',
      'Maintenance and cleaning tools for pools.',
      poolAccessories.id,
    )
    await createCategory(
      'Pool Toys',
      'Recreational toys and games for pool fun.',
      poolAccessories.id,
    )
    await createCategory(
      'Pool Robots',
      'Automatic pool cleaning robots and equipment.',
      poolAccessories.id,
    )

    // Outdoor Living subcategories
    await createCategory(
      'Patio Furniture',
      'Stylish and durable outdoor furniture.',
      outdoorLiving.id,
    )
    await createCategory(
      'Fire Features',
      'Outdoor fire pits and heating solutions.',
      outdoorLiving.id,
    )

    console.log('Successfully seeded product categories')
  } catch (error) {
    console.error('Failed to seed product categories:', error)
    throw error
  }
}

seedProductCategories()
  .then(() => {
    console.log('Seeding script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error in seeding script:', error)
    process.exit(1)
  })
