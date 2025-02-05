import { BasePayload, CollectionAfterChangeHook } from 'payload'
import { PRODUCT_CATEGORY_SLUG } from '@payload/collections/constants'
import { log } from '@/lib/utils/log'

/**
 * Updates the fullSlug for a category and all its descendants
 */
async function updateFullSlugHierarchy(payload: BasePayload, category: any): Promise<void> {
  log(`\n🔄 Starting updateFullSlugHierarchy for category: ${category.title} (${category.id})`)

  try {
    // Build the fullSlug for this category
    let fullSlug = category.slug
    log(`📌 Initial slug: ${fullSlug}`)

    if (category.parent) {
      log(`👆 Category has parent: ${JSON.stringify(category.parent)}`)
      const parentId = typeof category.parent === 'object' ? category.parent.id : category.parent
      log(`🔍 Looking up parent with ID: ${parentId}`)

      const parent = await payload.findByID({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parentId,
      })

      if (parent) {
        log(`✅ Parent found: ${parent.title} with fullSlug: ${parent.fullSlug}`)
        fullSlug = `${parent.fullSlug}/${category.slug}`
        log(`📝 New fullSlug constructed: ${fullSlug}`)
      } else {
        log('⚠️ Parent not found!')
      }
    } else {
      log('ℹ️ No parent - this is a root category')
    }

    // Get all descendants before updating
    log(`\n🔍 Finding all immediate descendants of ${category.title}`)
    const descendants = await payload.find({
      collection: PRODUCT_CATEGORY_SLUG,
      where: {
        'parent.id': { equals: category.id },
      },
    })
    log(`📊 Found ${descendants.totalDocs} immediate descendants`)

    // Update current category first
    log(`\n📝 Updating current category (${category.title}) with fullSlug: ${fullSlug}`)
    await payload.update({
      collection: PRODUCT_CATEGORY_SLUG,
      id: category.id,
      data: { fullSlug },
      context: { isInternalOperation: true, skipFullSlugUpdate: true },
    })

    // Update immediate descendants sequentially
    for (const child of descendants.docs) {
      const childFullSlug = `${fullSlug}/${child.slug}`
      log(`\n📝 Updating child ${child.title} with fullSlug: ${childFullSlug}`)
      await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: child.id,
        data: { fullSlug: childFullSlug },
        context: { isInternalOperation: true, skipFullSlugUpdate: true },
      })

      // Recursively update child's descendants
      await updateFullSlugHierarchy(payload, {
        ...child,
        fullSlug: childFullSlug,
      })
    }

    log(`✅ Completed fullSlug updates for ${category.title} and its descendants`)
  } catch (error) {
    console.error(`❌ Error in updateFullSlugHierarchy for ${category.title}:`, error)
    throw error
  }
}

export const afterChange: CollectionAfterChangeHook = async ({
  req: { payload },
  operation,
  doc,
  previousDoc,
  context = {},
}) => {
  log(`\n🎯 afterChange hook triggered for ${doc.title}`)
  log(`📋 Operation: ${operation}`)
  log(`🔑 Context:`, context)

  // Skip if this is an internal operation
  if (context.isInternalOperation) {
    log('⏭️ Skipping - internal operation')
    return doc
  }

  try {
    // Handle parent isLeaf updates
    if (operation === 'create' && doc.parent) {
      log('\n📝 Handling create operation with parent')
      const parentId = typeof doc.parent === 'object' ? doc.parent.id : doc.parent
      log(`🔄 Updating parent ${parentId} to non-leaf`)
      // Run parent update first
      await payload.update({
        collection: PRODUCT_CATEGORY_SLUG,
        id: parentId,
        data: { isLeaf: false },
        context: { isInternalOperation: true },
      })
    } else if (operation === 'update' && doc.parent !== previousDoc?.parent) {
      log('\n📝 Handling parent change')
      log(`Previous parent: ${JSON.stringify(previousDoc?.parent)}`)
      log(`New parent: ${JSON.stringify(doc.parent)}`)

      // Handle new parent first
      if (doc.parent) {
        const newParentId = typeof doc.parent === 'object' ? doc.parent.id : doc.parent
        log(`🔄 Updating new parent ${newParentId} to non-leaf`)
        const result = await payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: newParentId,
          data: { isLeaf: false },
          context: { isInternalOperation: true },
        })
        log('New parent update result isLeaf:', result.isLeaf)
      }

      // Then handle old parent
      if (previousDoc?.parent) {
        const oldParentId =
          typeof previousDoc.parent === 'object' ? previousDoc.parent.id : previousDoc.parent
        log(`🔍 Checking children count for old parent ${oldParentId}`)

        const oldParentChildren = await payload.find({
          collection: PRODUCT_CATEGORY_SLUG,
          where: {
            'parent.id': { equals: oldParentId },
            id: { not_equals: doc.id },
          },
        })
        log(`📊 Old parent has ${oldParentChildren.totalDocs} remaining children`)

        await payload.update({
          collection: PRODUCT_CATEGORY_SLUG,
          id: oldParentId,
          data: { isLeaf: oldParentChildren.totalDocs === 0 },
          context: { isInternalOperation: true },
        })
      }

      // Finally update fullSlug hierarchy
      if (!context.skipFullSlugUpdate) {
        log('\n🔄 Starting fullSlug hierarchy update')
        await updateFullSlugHierarchy(payload, doc)
      } else {
        log('⏭️ Skipping fullSlug update - already being handled')
      }
    }

    log('✅ afterChange hook completed\n')
    return doc
  } catch (error) {
    console.error('❌ Error in afterChange hook:', error)
    throw error
  }
}
