import type { Access } from 'payload'
import type { FieldAccess } from 'payload'
import { checkRole } from '@/payload/access/checkRole'
import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'
import { parse } from 'qs'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  if (user) {
    return true
  }
  return false
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const admin: Access = ({ req }) => {
  return req?.user?.roles?.includes('admin') ?? false
}

export const admins: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return checkRole(['admin'], user)
}

export const adminOrCurrentUser: Access = ({ req }) => {
  if (req?.user?.roles.includes('admin')) return true
  return { id: { equals: req.user?.id } }
}

export const anyone: Access = () => true

export const adminsOrOrderedBy: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true

  return {
    orderedBy: {
      equals: user?.id,
    },
  }
}
export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (checkRole(['admin'], user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * Access control for Orders based on the user's role and the query string
 */
export const adminsOrOrderedByOrPaymentId: Access = ({ data, req, req: { user } }) => {
  if (checkRole(['admin'], user)) {
    return true
  }

  const searchParams = req.searchParams
  const where = searchParams.get('where')

  const query = where ? parse(where) : {}
  // @ts-ignore
  const paymentIntentID = query?.stripePaymentIntentID?.equals

  if (paymentIntentID) {
    return {
      stripePaymentIntentID: {
        equals: paymentIntentID,
      },
    }
  }

  return {
    orderedBy: {
      equals: user?.id,
    },
  }
}
