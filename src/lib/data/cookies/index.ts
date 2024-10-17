import 'server-only'

import { cookies } from 'next/headers'

export async function getCartCookie(): Promise<string | null> {
  const cookiestore = await cookies()
  const value = cookiestore.get('_cart_id')?.value

  if (!value) {
    return null
  }

  return value
}

export const setCartCookie = async (cartId: string) => {
  const cookiestore = await cookies()
  cookiestore.set('_cart_id', cartId, {
    maxAge: 60 * 60 * 24 * 7, // This is 7 days in seconds (604800 seconds)
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}

export const removeCartCookie = async () => {
  // Both methods are valid, but cookies().delete('_cart_id') is more straightforward
  // and is the recommended approach for removing cookies in Next.js
  const cookiestore = await cookies()
  cookiestore.delete('_cart_id')
}
