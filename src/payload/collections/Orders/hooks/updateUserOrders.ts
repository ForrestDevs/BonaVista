import type { CollectionAfterChangeHook } from 'payload'

import type { Order } from '../../../../payload-types'
import { CUSTOMER_SLUG } from '@payload/collections/constants'

/**
 * Creates a new order in the user's orders array
 */
export const updateUserOrders: CollectionAfterChangeHook<Order> = async ({
  doc,
  operation,
  req,
}) => {
  const { payload } = req

  if ((operation === 'create' || operation === 'update') && doc.orderedBy && doc.lineItems) {
    const orderedBy = typeof doc.orderedBy === 'object' ? doc.orderedBy.id : doc.orderedBy

    const user = await payload.findByID({
      id: orderedBy,
      collection: CUSTOMER_SLUG,
    })

    if (user) {
      await payload.update({
        id: orderedBy,
        collection: CUSTOMER_SLUG,
        data: {
          orders: [
            ...(user?.orders?.map((order) => (typeof order === 'object' ? order.id : order)) || []),
            doc.id,
          ],
        },
      })
    }
  }

  return
}
