'use server'

import { cookies } from 'next/headers'
import { safeJsonParse } from '@lib/utils/safeJSONParse'

export type CartCookieJson = { id: string; linesCount: number }

export async function getCartCookie(): Promise<null | CartCookieJson> {
  const cookiesValue = await cookies()
  const cartCookieJson = safeJsonParse(cookiesValue.get('_cart_id')?.value)

  if (
    !cartCookieJson ||
    typeof cartCookieJson !== 'object' ||
    !('id' in cartCookieJson) ||
    !('linesCount' in cartCookieJson) ||
    typeof cartCookieJson.id !== 'string' ||
    typeof cartCookieJson.linesCount !== 'number'
  ) {
    return null
  }
  return cartCookieJson as CartCookieJson
}

export const setCartCookie = async (cartCookieJson: CartCookieJson) => {
  const cookiestore = await cookies()
  try {
    cookiestore.set('_cart_id', JSON.stringify(cartCookieJson), {
      maxAge: 60 * 60 * 24 * 7, // This is 7 days in seconds (604800 seconds)
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
  } catch (error) {
    console.error('Failed to set cart cookie', error)
  }
}

// export async function removeCartCookie() {
//   // Both methods are valid, but cookies().delete('_cart_id') is more straightforward
//   // and is the recommended approach for removing cookies in Next.js
//   const cookiestore = await cookies()
//   cookiestore.delete('_cart_id')
// }

export async function removeCartCookie(): Promise<void> {
  ;(await cookies()).set('_cart_id', '', {
    maxAge: 0,
  })
}
