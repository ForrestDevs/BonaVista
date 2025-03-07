'use server'

import getPayload from '@lib/utils/getPayload'
import { LoginSchema, RegisterSchema } from '@lib/validations/auth'
import { Customer, User } from '@payload-types'
import { CUSTOMER_SLUG, USER_SLUG } from '@payload/collections/constants'
import { headers as getHeaders } from 'next/headers'
import { cookies } from 'next/headers'
import { mergeCarts } from '../cart'
import { deleteCartCookie } from '../cookies'

export async function login(data: LoginSchema) {
  const payload = await getPayload()
  const { email, password } = data
  let user: User | null = null

  try {
    const result = await payload.login({
      collection: USER_SLUG,
      data: {
        email,
        password,
      },
    })
    user = result.user
    const cookiestore = await cookies()
    cookiestore.set('payload-token', result.token)
    console.log('user logged in')
  } catch (error) {
    console.error(error)
    return { status: 'error', message: 'Invalid email or password' }
  }

  const customerId = typeof user?.customer === 'number' ? user.customer : user.customer.id

  console.log('merging carts')
  const mergedCarts = await mergeCarts(customerId)
  console.log('mergedCarts', mergedCarts)

  if (!mergedCarts) {
    return { status: 'success', message: 'Logged in successfully' }
  }

  return {
    status: 'success',
    message: 'Logged in successfully',
  }
}

export async function logout() {
  console.log('logout')
  const cookiestore = await cookies()
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `JWT ${cookiestore.get('payload-token')?.value}`,
    },
  })

  const data = await res.json()

  if (data.message) {
    cookiestore.delete('payload-token')
    await deleteCartCookie()
    return {
      message: 'User logged out',
    }
  } else {
    return {
      message: 'User not logged in',
    }
  }
}

export async function register(data: RegisterSchema) {
  const payload = await getPayload()
  const { email, password, firstName, lastName, phone, passwordConfirm } = data

  if (password !== passwordConfirm) {
    return { message: 'Passwords do not match' }
  }

  try {
    // create user
    const user = await payload.create({
      collection: USER_SLUG,
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        roles: ['customer'],
      },
    })

    //see if guest customer exists
    const guestCustomer = await payload.find({
      collection: CUSTOMER_SLUG,
      where: {
        and: [
          {
            email: {
              equals: email,
            },
          },
          {
            has_account: {
              equals: false,
            },
          },
        ],
      },
    })

    let customer: Customer
    if (guestCustomer.totalDocs > 0) {
      customer = await payload.update({
        collection: CUSTOMER_SLUG,
        id: guestCustomer.docs[0].id,
        data: {
          firstName,
          lastName,
          phone,
          email,
        },
      })
    } else {
      // create customer
      customer = await payload.create({
        collection: CUSTOMER_SLUG,
        data: {
          firstName,
          lastName,
          phone,
          email,
          has_account: true,
          account: user.id,
        },
      })
    }

    // update user
    const updatedUser = await payload.update({
      collection: USER_SLUG,
      id: user.id,
      data: {
        customer: customer.id,
      },
    })
    console.log('updatedUser', updatedUser)
  } catch (error) {
    console.error(error)
    return { message: 'Invalid email or password or customer already exists' }
  }

  // login user
  const loginResult = await login({ email, password })
  console.log('loginResult', loginResult)

  return {
    message: 'User created',
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const payload = await getPayload()
  const headers = await getHeaders()

  try {
    const { user } = await payload.auth({ headers })

    if (!user) {
      return null
    }

    return user as User
  } catch (error) {
    console.error('No current user signed in', error)
    return null
  }
}
