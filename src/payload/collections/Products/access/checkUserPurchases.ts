import type { FieldAccess } from 'payload'
import type { Product } from '@/payload-types'
import { checkRole } from '@/payload/collections/Users/checkRole'

// we need to prevent access to documents behind a paywall
// to do this we check the document against the user's list of active purchases
export const checkUserPurchases: FieldAccess<Product> = async ({
  doc,
  req: { user },
}) => {
  if (!user) {
    return false
  }

  if (checkRole(['admin'], user)) {
    return true
  }

  if (
    doc &&
    user &&
    typeof user === 'object' &&
    (user.purchases?.length ?? 0) > 0
  ) {
    const hasPurchased = user.purchases?.some(
      purchase =>
        doc.id === (typeof purchase === 'object' ? purchase.id : purchase),
    )

    return hasPurchased ?? false
  }

  return false
}
