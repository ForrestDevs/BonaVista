import getPayload from '@/lib/utils/getPayload'
import { COLLECTION_SLUG_USERS } from '@/payload/collections/constants'

export async function logCustomerIn(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const payload = await getPayload()

  try {
    await payload.login({
      collection: COLLECTION_SLUG_USERS,
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
      collection: COLLECTION_SLUG_USERS,
      data: {
        ...customer,
        roles: ['customer'],
      },
    })

    await payload.login({
      collection: COLLECTION_SLUG_USERS,
      data: {
        email: customer.email,
        password: customer.password,
      },
    })
  } catch (error: any) {
    return error.toString()
  }
}
