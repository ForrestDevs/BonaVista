import type { Access } from 'payload'
import type { FieldAccess } from 'payload'
import { checkRole } from '../collections/Users/checkRole'
import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  if (user) {
    return true
  }
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
