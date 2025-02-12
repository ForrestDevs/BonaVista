import { PayloadRequest } from 'payload'
import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'

export const isLeafCategory = async (req: PayloadRequest, categoryData: any): Promise<boolean> => {
  if (!categoryData.id) return true // New categories are leaf by default

  console.log('isLeafCategory', categoryData.title, categoryData.parent, categoryData.is_leaf)

  const childCategories = await req.payload.find({
    collection: PRODUCT_CATEGORY_SLUG,
    where: {
      'parent.id': {
        equals: categoryData.id,
      },
    },
  })

  return childCategories.totalDocs === 0
}
