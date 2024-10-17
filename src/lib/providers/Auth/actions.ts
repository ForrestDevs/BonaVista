'use server'

import getPayload from '@lib/utils/getPayload'
import { User } from '@payload-types'
import { CUSTOMER_SLUG, USER_SLUG } from '@payload/collections/constants'
import { headers as getHeaders } from 'next/headers'

export async function getCurrentUser(): Promise<User | null> {
  const payload = await getPayload()
  const headers = await getHeaders()

  try {
    const { user } = await payload.auth({ headers })
    return user as User
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export async function createUser(email: string, password: string): Promise<User | null> {
  const payload = await getPayload()

  try {
    const user = await payload.create({
      collection: USER_SLUG,
      data: {
        email,
        password,
      },
    })

    console.log('created user', user)

    const customer = await payload.create({
      collection: CUSTOMER_SLUG,
      data: {
        email,
        account: user.id,
        has_account: true,
      },
    })

    console.log('created customer', customer)

    payload.update({
      collection: USER_SLUG,
      id: user.id,
      data: {
        customer: customer.id,
      },
    })

    console.log('updated user', user)

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const payload = await getPayload()

  try {
    const { user, token } = await payload.login({
      collection: USER_SLUG,
      data: {
        email,
        password,
      },
    })

    return user
  } catch (error) {
    console.error('Error logging in user:', error)
    return null
  }
}

export async function forgotPassword(email: string): Promise<boolean> {
  const payload = await getPayload()

  try {
    await payload.forgotPassword({
      collection: USER_SLUG,
      data: {
        email,
      },
    })
    return true
  } catch (error) {
    console.error('Error initiating forgot password:', error)
    return false
  }
}

export async function resetPassword(token: string, password: string) {
  const payload = await getPayload()

  try {
    const result = await payload.resetPassword({
      collection: USER_SLUG,
      overrideAccess: true,
      data: {
        password,
        token,
      },
    })

    return result
  } catch (error) {
    console.error('Error resetting password:', error)
    return null
  }
}
