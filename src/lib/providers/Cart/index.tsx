'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import type { Product, User } from '@/payload-types'
import type { CartItem } from './reducer'
import { useAuth } from '@payloadcms/ui'
import { cartReducer } from './reducer'

export type CartContext = {
  addItemToCart: (item: CartItem) => void
  cart: User['cart']
  cartIsEmpty: boolean | undefined
  cartTotal: {
    formatted: string
    raw: number
  }
  clearCart: () => void
  deleteItemFromCart: (product: Product) => void
  hasInitializedCart: boolean
  isProductInCart: (product: Product) => boolean
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = (array: any) => Array.isArray(array) && array.length > 0

/**
 * ensure that cart items are fully populated, filter out any items that are not
 * this will prevent discontinued products from appearing in the cart
 */
const flattenCart = (cart: User['cart']): User['cart'] => ({
  ...cart,
  items: cart?.items
    ?.filter(Boolean)
    .map((item) => {
      if (!item?.product || typeof item?.product !== 'object') {
        return null
      }

      return {
        ...item,
        // flatten relationship to product
        product: item?.product?.id,
        quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
      }
    })
    .filter(Boolean) as CartItem[],
})

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only

export const CartProvider = (props: any) => {
  // const { setTimedNotification } = useNotifications();
  const { children } = props
  const { user } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, {})

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // Check local storage for a cart
  // If there is a cart, fetch the products and hydrate the cart
  useEffect(() => {
    // wait for the user to be defined before initializing the cart
    if (user === undefined) return
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')

        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart?.items?.length > 0) {
          const initialCart = await Promise.all(
            parsedCart.items.map(async ({ product, quantity }: { product: any; quantity: any }) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${product}`,
              )
              const data = await res.json()
              return {
                product: data,
                quantity,
              }
            }),
          )

          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: initialCart,
            },
          })
        } else {
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: [],
            },
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [user])

  // authenticate the user and if logged in, merge the user's cart with local state
  // only do this after we have initialized the cart to ensure we don't lose any items
  useEffect(() => {
    if (!hasInitialized.current) return

    if (user && user?.cart?.items?.length > 0) {
      // merge the user's cart with the local state upon logging in
      dispatchCart({
        type: 'MERGE_CART',
        payload: user?.cart,
      })
    }

    if (user === null) {
      // clear the cart from local state after logging out
      dispatchCart({
        type: 'CLEAR_CART',
      })
    }
  }, [user])

  // every time the cart changes, determine whether to save to local storage or Payload based on authentication status
  // upon logging in, merge and sync the existing local cart to Payload
  useEffect(() => {
    // wait until we have attempted authentication (the user is either an object or `null`)
    if (!hasInitialized.current || user === undefined || !cart?.items) return

    const flattenedCart = flattenCart(cart)

    if (user) {
      // prevent updating the cart when the cart hasn't changed
      if (JSON.stringify(flattenCart(user.cart)) === JSON.stringify(flattenedCart)) {
        setHasInitialized(true)
        return
      }

      try {
        const syncCartToPayload = async () => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            // Make sure to include cookies with fetch
            body: JSON.stringify({
              cart: flattenedCart,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
          })

          if (req.ok) {
            localStorage.setItem('cart', '[]')
          }
        }

        syncCartToPayload()
      } catch (e) {
        console.error('Error while syncing cart to Payload.') // eslint-disable-line no-console
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitialized(true)
  }, [user, cart])

  const isProductInCart = useCallback(
    (incomingProduct: Product): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,
          ), // eslint-disable-line function-paren-newline
        )
      }
      return isInCart
    },
    [cart],
  )

  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback((incomingItem: any) => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback((incomingProduct: Product) => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  // calculate the new cart total whenever the cart changes
  useEffect(() => {
    if (!hasInitialized) return

    const newTotal =
      cart?.items?.reduce((acc, item) => {
        return (
          acc +
          (typeof item.product === 'object'
            ? JSON.parse(item?.product?.priceJSON || '{}')?.data?.[0]?.unit_amount *
              (typeof item?.quantity === 'number' ? item?.quantity : 0)
            : 0)
        )
      }, 0) || 0

    setTotal({
      formatted: (newTotal / 100).toLocaleString('en-US', {
        currency: 'USD',
        style: 'currency',
      }),
      raw: newTotal,
    })
  }, [cart, hasInitialized])

  return (
    <Context.Provider
      value={{
        addItemToCart,
        cart,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        cartTotal: total,
        clearCart,
        deleteItemFromCart,
        hasInitializedCart,
        isProductInCart,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}