'use client'

import React, {
  useCallback,
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useContext,
} from 'react'
import type { Product, User } from '@/payload-types'
import { cartReducer } from './reducer'
import { arrayHasItems, flattenCart } from '@/lib/utils/cart'
import { CartItem, CartTotalState, CartType } from '@/lib/types/cart'

export type CartContextProps = {
  hasInitializedCart: boolean
  cart: CartType
  cartIsEmpty: boolean | undefined
  cartTotal: {
    formatted: string
    raw: number
  }
  addItemToCart: (item: CartItem) => void
  deleteItemFromCart: (product: Product, variantId?: string) => void
  isProductInCart: (product: Product, variantId?: string) => boolean
  clearCart: () => void
}

const CartContext = createContext({} as CartContextProps)

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only
export default function CartProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)
  const [cart, dispatchCart] = useReducer(cartReducer, {})
  const [total, setTotal] = useState<CartTotalState>({
    formatted: '0.00',
    raw: 0,
  })

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
        payload: {
          items: Array.isArray(user.cart.items) ? user.cart.items : [],
        },
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

  // calculate the new cart total whenever the cart changes
  useEffect(() => {
    console.log('Calculating cart total')
    if (!hasInitialized) return

    const newTotal =
      cart?.items?.reduce((acc, item) => {
        if (typeof item.product !== 'object') return acc

        let price = 0
        if (item.product && item.product.hasVariants && item.variant) {
          price = JSON.parse(item.variant.priceJSON || '{}')?.unit_amount || 0
        } else if (item.product && !item.product.hasVariants && item.product.baseVariant) {
          price = JSON.parse(item.product.baseVariant.priceJSON || '{}')?.unit_amount || 0
        }

        return acc + price * (typeof item?.quantity === 'number' ? item?.quantity : 0)
      }, 0) || 0

    setTotal({
      formatted: (newTotal / 100).toLocaleString('en-US', {
        currency: 'CAD',
        style: 'currency',
      }),
      raw: newTotal,
    })
  }, [cart, hasInitialized])

  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback((incomingItem: CartItem) => {
    console.log('Adding item to cart', incomingItem)
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  // this method can be used to check if a product is in the cart
  const isProductInCart = useCallback(
    (incomingProduct: Product, variantId?: string): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find((item) => {
            const productMatch =
              typeof item.product === 'string'
                ? item.product === incomingProduct.id
                : item.product?.id === incomingProduct.id

            const variantMatch = variantId ? item.variant?.id === variantId : true

            return productMatch && variantMatch
          }),
        )
      }
      return isInCart
    },
    [cart],
  )

  // this method can be used to delete an item from the cart
  const deleteItemFromCart = useCallback((incomingProduct: Product, variantId?: string) => {
    console.log('Deleting item from cart', incomingProduct)
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: { product: incomingProduct, variantId },
    })
  }, [])

  // this method can be used to clear the cart
  const clearCart = useCallback(() => {
    console.log('Clearing cart')
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  return (
    <CartContext.Provider
      value={{
        hasInitializedCart,
        cart,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        cartTotal: total,
        addItemToCart,
        isProductInCart,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
