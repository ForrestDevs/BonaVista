import { CollectionBeforeDeleteHook } from 'payload'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_SLUG } from '@payload/collections/constants'
import { log } from '@/lib/utils/log'

// Keep track of categories being deleted in the current batch
const pendingDeletions = new Set<string | number>()

export const beforeDelete: CollectionBeforeDeleteHook = async ({ req: { payload }, id }) => {
  log(`\n🗑️ Starting beforeDelete hook for category ID: ${id}`)
  pendingDeletions.add(id)

  try {
    // Check for children categories first
    log('🔍 Checking for child categories...')
    const children = await payload.find({
      collection: PRODUCT_CATEGORY_SLUG,
      where: {
        'parent.id': { equals: id },
      },
    })

    if (children.totalDocs > 0) {
      log(`❌ Found ${children.totalDocs} child categories, cannot delete`)
      const childrenTitles = children.docs.map((child) => `"${child.title}"`).join(', ')
      throw new Error(
        `Cannot delete category with children. Please remove or reassign these categories first: ${childrenTitles}`,
      )
    }
    log('✅ No child categories found')

    // Check for assigned products
    log('🔍 Checking for assigned products...')
    const products = await payload.find({
      collection: PRODUCT_SLUG,
      where: {
        category: { in: [id] },
      },
      limit: 100,
    })

    if (products.totalDocs > 0) {
      log(`❌ Found ${products.totalDocs} assigned products, cannot delete`)
      const productTitles = products.docs.map((product) => `"${product.title}"`).join(', ')
      const remainingCount = Math.max(0, products.totalDocs - 100)
      const additionalMessage = remainingCount > 0 ? ` and ${remainingCount} more products` : ''

      throw new Error(
        `Cannot delete category that has products assigned to it. Please remove or reassign these products first: ${productTitles}${additionalMessage}`,
      )
    }
    log('✅ No assigned products found')

    // Get category to update parent's isLeaf status after deletion
    log('🔍 Checking for parent category...')
    const category = await payload.findByID({
      collection: PRODUCT_CATEGORY_SLUG,
      id,
    })

    if (category?.parent) {
      const parentId = typeof category.parent === 'object' ? category.parent.id : category.parent
      log(`📌 Found parent category ID: ${parentId}`)

      log('🔍 Checking remaining siblings...')
      const siblings = await payload.find({
        collection: PRODUCT_CATEGORY_SLUG,
        where: {
          and: [
            { 'parent.id': { equals: parentId } },
            { id: { not_equals: id } },
            // Exclude other categories being deleted in this batch
            { id: { not_in: Array.from(pendingDeletions) } },
          ],
        },
      })
      log(`📊 Found ${siblings.totalDocs} remaining siblings (excluding pending deletions)`)

      // If this was the last remaining child, mark parent as leaf
      if (siblings.totalDocs === 0) {
        log(`📝 Updating parent ${parentId} to leaf status (no remaining children)`)
        await payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: parentId,
          data: { isLeaf: true },
          context: { isInternalOperation: true },
        })
        log('✅ Parent updated to leaf status')
      } else {
        log(`ℹ️ Parent remains non-leaf (has ${siblings.totalDocs} other children)`)
      }
    } else {
      log('ℹ️ No parent category found')
    }

    log('✅ beforeDelete hook completed successfully\n')
    return true
  } finally {
    // Clean up the tracking set after the operation completes
    pendingDeletions.delete(id)
  }
}
