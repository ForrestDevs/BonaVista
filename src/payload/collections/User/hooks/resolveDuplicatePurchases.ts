import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const resolveDuplicatePurchases: FieldHook<User> = async ({ operation, value }) => {
  if ((operation === 'create' || operation === 'update') && value) {
    return Array.from(
      new Set(
        (value as User['purchases'])?.map((purchase) =>
          typeof purchase === 'object' ? purchase.id : purchase,
        ) || [],
      ),
    )
  }

  return
}
