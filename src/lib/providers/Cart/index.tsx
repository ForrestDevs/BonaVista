'use client'

import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import type { Product, User } from '@/payload-types'
import { useAuth } from '@payloadcms/ui'
import { cartReducer } from './reducer'
import { CartContext } from './context'
import { arrayHasItems, flattenCart } from '@/lib/utils/cart'
import { CartTotalState } from '@/lib/types/cart'
import { getMeUser } from '@/lib/utils/getMeUser'

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getMeUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  const hasInitialized = useRef(false)
  const [cart, dispatchCart] = useReducer(cartReducer, {})
  const [total, setTotal] = useState<CartTotalState>({
    formatted: '0.00',
    raw: 0,
  })
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // Check local storage for a cart
  // If there is a cart, fetch the products and hydrate the cart
  useEffect(() => {
    console.log('Initializing cart', user)
    // wait for the user to be defined before initializing the cart
    if (user === null) return
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
    console.log('Authenticating user', user)
    if (!hasInitialized.current) return

    if (user && user?.cart?.items?.length) {
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
    console.log('Syncing cart')
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
    console.log('Adding item to cart', incomingItem)
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback((incomingProduct: Product) => {
    console.log('Deleting item from cart', incomingProduct)
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    console.log('Clearing cart')
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  // calculate the new cart total whenever the cart changes
  useEffect(() => {
    console.log('Calculating cart total')
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
        currency: 'CAD',
        style: 'currency',
      }),
      raw: newTotal,
    })
  }, [cart, hasInitialized])

  return (
    <CartContext.Provider
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
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
