'use server'

import getPayload from '@lib/utils/getPayload'
import { USER_SLUG, ORDER_SLUG } from '@payload/collections/constants'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import type { User } from '@payload-types'
import { getCustomer } from '@/lib/data/customer'

export async function signOut() {
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  redirect(`/shop/account`)
}

export async function getCurrentUser() {
  const payload = await getPayload()
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    return null
  }

  return user as User
}

export async function getCurrentUserOrders() {
  const payload = await getPayload()
  const customer = await getCustomer()

  if (!customer) {
    return null
  }

  const orders = await payload
    .find({
      collection: ORDER_SLUG,
      where: {
        orderedBy: {
          equals: customer.id,
        },
      },
    })
    .then((docs) => docs.docs)

  return orders
}

export async function logCustomerIn(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const payload = await getPayload()

  try {
    await payload.login({
      collection: USER_SLUG,
      data: {
        email,
        password,
      },
    })
  } catch (error: any) {
    return error.toString()
  }
}

export async function signUp(_currentState: unknown, formData: FormData) {
  const payload = await getPayload()
  const customer = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  }

  try {
    await payload.create({
      collection: USER_SLUG,
      data: {
        ...customer,
        roles: ['customer'],
      },
    })

    await payload.login({
      collection: USER_SLUG,
      data: {
        email: customer.email,
        password: customer.password,
      },
    })
  } catch (error: any) {
    return error.toString()
  }
}
