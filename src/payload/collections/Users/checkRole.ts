import type { User } from '@/payload-types'

export const checkRole = (role: User['roles'], user?: User): boolean => {
  if (user) {
    if (role.some((r) => user.roles.includes(r))) {
      return true
    }
  }
  return false
}
