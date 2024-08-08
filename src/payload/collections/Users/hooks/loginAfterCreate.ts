import type { CollectionAfterChangeHook } from 'payload'

export const loginAfterCreate: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation === 'create' && !req.user) {
    if (doc.email && doc.password) {
      const { token, user } = await req.payload.login({
        collection: 'users',
        data: { email: doc.email, password: doc.password },
        req,
      })

      return {
        ...doc,
        token,
        user,
      }
    }
  }

  return doc
}
