import 'server-only'

import { cookies } from 'next/headers'
import { safeJsonParse } from '@lib/utils/safeJSONParse'
import { revalidateTag } from 'next/cache'

export type CartCookieJson = { id: string; linesCount: number }

export async function getCartCookie(): Promise<null | CartCookieJson> {
  const cookiesValue = await cookies()
  const cartCookieJson = safeJsonParse(cookiesValue.get('_cart_cookie')?.value)

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

export async function setCartCookie(cartCookieJson: CartCookieJson) {
  const cookiestore = await cookies()
  try {
    cookiestore.set('_cart_cookie', JSON.stringify(cartCookieJson), {
      maxAge: 60 * 60 * 24 * 7, // This is 7 days in seconds (604800 seconds)
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
  } catch (error) {
    console.error('Failed to set cart cookie', error)
  }
}

export async function deleteCartCookie() {
  const cookie = await getCartCookie()
  if (!cookie) {
    return
  }

  const cookiestore = await cookies()
  cookiestore.delete('_cart_cookie')
  revalidateTag(`cart-${cookie.id}`)
}

export async function deleteCartCookieById(id: string) {
  try {
    const cookie = await getCartCookie()
    if (!cookie) {
      throw new Error('Cart cookie not found')
    }
    if (cookie.id !== id) {
      throw new Error('Cart cookie id does not match')
    }
    const cookiestore = await cookies()
    cookiestore.delete('_cart_cookie')
  } catch (error) {
    console.error('Failed to delete cart cookie', error)
    return
  }
}
