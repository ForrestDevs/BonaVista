'use client'

import type { InfoType } from '@payload/collections/Products/ui/types'
import type {
  Cart,
  Product,
  User,
  CartItems,
  Address,
  ProductVariant,
  Customer,
} from '@payload-types'

import { parse } from 'path'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
} from 'react'

import { useAuth } from '../Auth'
import { cartReducer } from './reducer'
import { CartItem } from '@lib/types/cart'
import {
  createCart,
  createCartWithCustomer,
  deleteCart,
  fetchCartById,
  getCustomer,
  getFullUser,
  updateCart,
} from './actions'

export type CartContext = {
  addItemToCart: (item: CartItem) => void
  cart: Cart
  cartIsEmpty: boolean | undefined
  cartQuantity: number
  cartTotal: {
    amount: number
    currency: string
  }
  setShippingAddress: (address: Address) => void
  setBillingAddress: (address: Address) => void
  clearCart: () => void
  decrementQuantity: (id: string) => void
  deleteItemFromCart: (id: string) => void
  hasInitializedCart: boolean
  incrementQuantity: (id: string) => void
  isProductInCart: (product: Product, variantId?: string) => boolean
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = (array) => Array.isArray(array) && array.length > 0

/**
 * ensure that cart items are fully populated, filter out any items that are not
 * this will prevent discontinued products from appearing in the cart
 */
const flattenCart = (cart: Cart): Cart => ({
  ...cart,
  items: cart?.items
    ?.map((item) => {
      if (!item?.product) {
        return null
      }

      // let stripeProductID

      if (typeof item.product !== 'string') {
        if (item.variant) {
          const variant = item.product.variants?.variantProducts.find((v) => v.id === item.variant)
          // if (variant?.stripeProductID) stripeProductID = variant.stripeProductID
        }
        // if (item.product.stripeProductID) stripeProductID = item.product.stripeProductID
      }

      return {
        ...item,
        // flatten relationship to product
        product: typeof item.product === 'string' ? item.product : item.product.id,
        quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
        // stripeProductID,
        variant: item?.variant,
      }
    })
    .filter(Boolean) as CartItem[],
})


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // const { setTimedNotification } = useNotifications();
  const { status: authStatus, user } = useAuth()
  const [cart, dispatchCart] = useReducer(cartReducer, null)
  const [quantity, setQuantity] = useState<number>(0)
  const [total, setTotal] = useState<{
    amount: number
    currency: string
  }>({
    amount: 0,
    currency: 'usd',
  })

  const hasInitialized = useRef(false)

  function optimisticAddItem(state, newMessage) {
    return [...state, newMessage]
  }

  // function optimisticRemoveItem(itemId: string) {
  //   setOptimisticItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  // }
 
  // const [optimisticItems, setOptimisticItems] = useOptimistic(cart?.items, optimisticAddItem)



  // const [customer, setCustomer] = useState<Customer | null>(null)
  // useEffect(() => {
  //   if (user && authStatus === 'loggedIn' && !hasFetchedFullUser.current) {
  //     console.log('user logged in, setting customer')
  //     const fetchFullUser = async () => {
  //       const fullUser = await getFullUser(user.id)
  //       setCustomer(fullUser?.customer)
  //       hasFetchedFullUser.current = true
  //     }
  //     void fetchFullUser()
  //   }
  // }, [user, authStatus])

  // // Initialize cart
  // useEffect(() => {
  //   console.log('initializing cart')
  //   if (!hasInitialized.current) {
  //     const initializeCart = async () => {
  //       const localCartId = localStorage.getItem('cart_id')
  //       console.log('localCartId', localCartId)
  //       let cart

  //       if (localCartId === null || localCartId === undefined) {
  //         // Case 1: No user or logged out, no local storage cart ID - create new cart
  //         console.log('Creating new cart, Case 1')
  //         const newCart = await createCart()
  //         if (newCart) {
  //           cart = newCart
  //         } else {
  //           console.error('Failed to create cart')
  //         }
  //       } else if (localCartId) {
  //         // Case 2: Fetch existing cart by ID
  //         console.log('Fetching existing cart, Case 2')
  //         const fetchedCart = await fetchCartById(localCartId)
  //         if (fetchedCart) {
  //           cart = fetchedCart
  //         } else {
  //           console.error('Failed to fetch cart')
  //         }
  //       }

  //       if (cart) {
  //         dispatchCart({ type: 'SET_CART', payload: cart })
  //         localStorage.setItem('cart_id', cart.id)
  //         hasInitialized.current = true
  //       } else {
  //         console.error('Failed to initialize cart')
  //       }
  //     }

  //     void initializeCart()
  //   }
  // }, []) // Empty dependency array means this effect runs once on component mount

  // // Handle cart changes when user auth status changes
  useEffect(() => {
    console.log('Auth status changed, running cart logic', authStatus)
    if (hasInitialized.current) {
      if (authStatus === 'loggedIn' && user) {
        const localCartId = localStorage.getItem('cart_id')
        console.log('User logged in, local cart id:', localCartId)
        if (localCartId) {
          console.log('Local cart to merge, Case 3')
          const mergeCarts = async () => {
            if (typeof user.customer === 'object') {
              console.log('User customer is an object')
              if (!user.customer.cart) {
                console.log('User customer doesnt have a cart, creating a new one')
                const newCart = await createCartWithCustomer(user.customer.id)
                if (newCart) {
                  dispatchCart({ type: 'MERGE_CART', payload: newCart })
                  // delete the local cart, before updating the local storage cart id
                  await deleteCart(localCartId)
                  // update the local storage cart id
                  localStorage.setItem('cart_id', newCart.id)
                }
              } else {
                console.log('User customer has a cart, merging the carts')
                if (typeof user.customer.cart === 'object') {
                  console.log('User customer cart is an object, merging the carts')
                  dispatchCart({ type: 'MERGE_CART', payload: user?.customer?.cart })
                  // delete the local cart, before updating the local storage cart id
                  await deleteCart(localCartId)
                  // update the local storage cart id
                  localStorage.setItem('cart_id', user?.customer?.cart?.id)
                } else if (typeof user.customer.cart === 'string') {
                  console.log('User customer cart is a string, fetching the cart')
                  const fetchedCart = await fetchCartById(user?.customer?.cart)
                  if (fetchedCart) {
                    dispatchCart({ type: 'MERGE_CART', payload: fetchedCart })
                    // delete the local cart, before updating the local storage cart id
                    await deleteCart(localCartId)
                    // update the local storage cart id
                    localStorage.setItem('cart_id', fetchedCart.id)
                  }
                }
              }
            } else if (typeof user.customer === 'string') {
              console.log('User customer is a string')
              const customer = await getCustomer(user.customer)

              if (!customer.cart) {
                console.log('Customer doesnt have a cart, creating a new one')
                // customer doesn't have a cart, create a new one
                const newCart = await createCartWithCustomer(customer.id)
                if (newCart) {
                  dispatchCart({ type: 'MERGE_CART', payload: newCart })
                  // delete the local cart, before updating the local storage cart id
                  await deleteCart(localCartId)
                  // update the local storage cart id
                  localStorage.setItem('cart_id', newCart.id)
                }
              } else {
                console.log('Customer has a cart')
                // customer has a cart, merge the carts
                if (typeof customer.cart === 'object') {
                  console.log('Customer cart is an object, merging the carts')
                  dispatchCart({ type: 'MERGE_CART', payload: customer.cart })
                  // delete the local cart, before updating the local storage cart id
                  await deleteCart(localCartId)
                  // update the local storage cart id
                  localStorage.setItem('cart_id', customer.cart.id)
                } else if (typeof customer.cart === 'string') {
                  console.log('Customer cart is a string, fetching the cart')
                  const fetchedCart = await fetchCartById(customer.cart)
                  if (fetchedCart) {
                    dispatchCart({ type: 'MERGE_CART', payload: fetchedCart })
                    // delete the local cart, before updating the local storage cart id
                    await deleteCart(localCartId)
                    // update the local storage cart id
                    localStorage.setItem('cart_id', fetchedCart.id)
                  } else {
                    console.error('Failed to fetch cart')
                  }
                }
              }
            }
          }
          void mergeCarts()
        } else if (!localCartId) {
          console.log('No local cart to merge, setting user cart, Case 4')
          // If there was no local cart to merge, just set the user's cart
          const setCarts = async () => {
            if (typeof user.customer === 'object') {
              // customer is an object, now check if the cart is a string or object
              if (typeof user.customer.cart === 'object') {
                // cart is an object, set the cart
                dispatchCart({ type: 'SET_CART', payload: user.customer.cart })
                localStorage.setItem('cart_id', user.customer.cart.id)
              } else if (typeof user.customer.cart === 'string') {
                // cart is a string, fetch the cart
                const fetchedCart = await fetchCartById(user.customer.cart)
                if (fetchedCart) {
                  dispatchCart({ type: 'SET_CART', payload: fetchedCart })
                  localStorage.setItem('cart_id', fetchedCart.id)
                }
              }
            } else if (typeof user.customer === 'string') {
              // customer is a string, fetch the customer
              const customer = await getCustomer(user.customer)

              if (!customer.cart) {
                // customer doesn't have a cart, create a new one
                const newCart = await createCartWithCustomer(customer.id)
                if (newCart) {
                  dispatchCart({ type: 'SET_CART', payload: newCart })
                  localStorage.setItem('cart_id', newCart.id)
                }
              } else {
                // customer has a cart, check if it's a string or object
                if (typeof customer.cart === 'object') {
                  // cart is an object, set the cart
                  dispatchCart({ type: 'SET_CART', payload: customer.cart })
                  localStorage.setItem('cart_id', customer.cart.id)
                } else if (typeof customer.cart === 'string') {
                  // cart is a string, fetch the cart
                  const fetchedCart = await fetchCartById(customer.cart)
                  if (fetchedCart) {
                    dispatchCart({ type: 'SET_CART', payload: fetchedCart })
                    localStorage.setItem('cart_id', fetchedCart.id)
                  }
                }
              }
            }
          }

          void setCarts()
        }
      } else if (authStatus === 'loggedOut' || !user) {
        console.log('User logged out or null, creating new cart')
        const createNewCart = async () => {
          try {
            const newCart = await createCart()
            if (newCart) {
              dispatchCart({ type: 'SET_CART', payload: newCart })
              localStorage.setItem('cart_id', newCart.id)
            } else {
              console.error('Failed to create new cart')
            }
          } catch (error) {
            console.error('Error creating new cart:', error)
          }
        }
        void createNewCart()
      }
    }
  }, [authStatus, user]) // This effect runs when auth status or user changes

  const userCart = useRef<Cart | null>(null)

  // useEffect(() => {
  //   const fetchUserCart = async () => {
  //     if (user && typeof user.customer === 'object') {
  //       if (typeof user.customer.cart === 'object') {
  //         userCart.current = user.customer.cart
  //       } else if (typeof user.customer.cart === 'string') {
  //         userCart.current = await fetchCartById(user.customer.cart)
  //       }
  //     } else if (user && typeof user.customer === 'string') {
  //       const customer = await getCustomer(user.customer)
  //       if (typeof customer.cart === 'object') {
  //         userCart.current = customer.cart
  //       } else if (typeof customer.cart === 'string') {
  //         userCart.current = await fetchCartById(customer.cart)
  //       }
  //     }
  //   }
  //   void fetchUserCart()
  // }, [user, authStatus])

  // // Effect to initialize or fetch cart
  // useEffect(() => {
  //   if (!hasInitialized.current) {
  //     const initOrFetchCart = async () => {
  //       const localCartId = localStorage.getItem('cart_id')
  //       let initialCart

  //       if (localCartId) {
  //         initialCart = await fetchCartById(localCartId)
  //       } else if (user && authStatus === 'loggedIn') {
  //         initialCart = userCart.current
  //       } else {
  //         initialCart = await createCart()
  //       }

  //       if (initialCart) {
  //         dispatchCart({ type: 'SET_CART', payload: initialCart })
  //         localStorage.setItem('cart_id', initialCart.id)
  //       }
  //       // setIsLoading(false)
  //       hasInitialized.current = true
  //     }

  //     void initOrFetchCart()
  //   }
  // }, [userCart, authStatus, user])

  // // Effect to handle login and merge carts
  // useEffect(() => {
  //   if (authStatus === 'loggedIn' && user && hasInitialized.current) {
  //     const mergeOrSetUserCart = async () => {
  //       const localCartId = localStorage.getItem('cart_id')
  //       if (localCartId && localCartId !== userCart.current?.id) {
  //         // const mergedCart = await mergeCartWithServer(localCartId, user.customer.cart)
  //         dispatchCart({ type: 'SET_CART', payload: userCart.current })
  //         localStorage.setItem('cart_id', userCart.current.id)
  //       } else if (!localCartId) {
  //         dispatchCart({ type: 'SET_CART', payload: userCart.current })
  //       }
  //     }

  //     void mergeOrSetUserCart()
  //   }
  // }, [authStatus, user])

  // useEffect(() => {
  //   if (authStatus === 'loggedOut') {
  //     const handleLogout = async () => {
  //       // Clear user-specific data from the cart but keep the cart for guest use
  //       const localCartId = localStorage.getItem('cart_id')
  //       if (localCartId) {
  //         // Here, we're assuming that the cart might have user-specific items or data
  //         // We might want to reset some parts of the cart or just keep it as is for guest use
  //         const guestCart = await fetchCartById(localCartId)
  //         if (guestCart) {
  //           dispatchCart({
  //             type: 'SET_CART',
  //             payload: {
  //               ...guestCart,
  //               customer: null,
  //             },
  //           })
  //         } else {
  //           // If for some reason the cart can't be fetched, create a new one
  //           const newCart = await createCart()
  //           dispatchCart({ type: 'SET_CART', payload: newCart })
  //           localStorage.setItem('cart_id', newCart.id)
  //         }
  //       } else {
  //         // If there was no cart ID, we might not need to do anything,
  //         // but for consistency, we could ensure there's a guest cart
  //         const newCart = await createCart()
  //         dispatchCart({ type: 'SET_CART', payload: newCart })
  //         localStorage.setItem('cart_id', newCart.id)
  //       }
  //     }

  //     void handleLogout()
  //   }
  // }, [authStatus])

  // Sync cart with server on every change
  useEffect(() => {
    console.log('Before syncing cart')
    if (hasInitialized.current) {
      console.log('Syncing cart with server, Case 5')
      const localCartId = localStorage.getItem('cart_id')
      const syncCart = async () => {
        try {
          await updateCart(localCartId, cart)
          // if (!updatedCart) {
          //   throw new Error('Failed to sync cart')
          // }
          // Optionally update the local state if the server returns an updated version
        } catch (error) {
          console.error('Error syncing cart:', error)
        }
      }

      void syncCart()
    }
  }, [cart])

  const isProductInCart = useCallback(
    (incomingProduct: Product, variantId?: string): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product, variant }) => {
            // Check for variant first
            if (variantId) {
              return variant === variantId
            } else {
              return typeof product === 'string'
                ? product === incomingProduct.id
                : product?.id === incomingProduct.id
            }
          }), // eslint-disable-line function-paren-newline
        )
      }
      return isInCart
    },
    [cart],
  )

  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback((incomingItem: CartItem) => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const incrementQuantity = useCallback((id: string) => {
    dispatchCart({
      type: 'INCREMENT_QUANTITY',
      payload: id,
    })
  }, [])

  const decrementQuantity = useCallback((id: string) => {
    dispatchCart({
      type: 'DECREMENT_QUANTITY',
      payload: id,
    })
  }, [])

  const deleteItemFromCart = useCallback((id: string) => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: id,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  const setShippingAddress = useCallback((address: Address) => {
    dispatchCart({
      type: 'SET_SHIPPING_ADDRESS',
      payload: address,
    })
  }, [])

  const setBillingAddress = useCallback((address: Address) => {
    dispatchCart({
      type: 'SET_BILLING_ADDRESS',
      payload: address,
    })
  }, [])

  // calculate the new cart total whenever the cart changes
  // useEffect(() => {
  //   if (!hasInitialized) return

  //   const newTotal =
  //     cart?.items?.reduce((acc, item) => {
  //       if (typeof item.product === 'string') return acc

  //       const isVariant = item.variant !== '' || item.variant !== undefined

  //       const itemPrice = isVariant
  //         ? item.product.variants?.variantProducts.find((v) => v.id === item.variant)?.price
  //         : item.product.baseProduct.price

  //       const itemCost = (itemPrice || 0) * item.quantity
  //       return acc + itemCost
  //     }, 0) || 0

  //   const newQuantity =
  //     cart?.items?.reduce((quantity, product) => product.quantity + quantity, 0) || 0

  //   setTotal({
  //     amount: newTotal,
  //     currency: 'CAD',
  //   })

  //   setQuantity(newQuantity)
  // }, [cart, hasInitialized])

  return (
    <Context.Provider
      value={{
        cart,
        hasInitializedCart: hasInitialized.current,
        cartIsEmpty: hasInitialized.current && !arrayHasItems(cart?.items),
        cartQuantity: quantity,
        cartTotal: total,
        addItemToCart,
        setShippingAddress,
        setBillingAddress,
        clearCart,
        decrementQuantity,
        deleteItemFromCart,
        incrementQuantity,
        isProductInCart,
      }}
    >
      {children}
    </Context.Provider>
  )
}

//case 1: no user, no local storage cart id
//case 2: no user, local storage cart id
// useEffect(() => {
//   if (user === undefined) {
//     const localCart = localStorage.getItem('cart_id')

//     if (!localCart) {
//       // No cart ID in local storage, create a new cart
//       const createCart = async () => {
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           })

//           if (response.ok) {
//             const newCart = await response.json()
//             localStorage.setItem('cart_id', newCart.id)
//             dispatchCart({
//               type: 'SET_CART',
//               payload: newCart,
//             })
//           } else {
//             console.error('Failed to create cart')
//           }
//         } catch (error) {
//           console.error('Error creating cart:', error)
//         }
//       }

//       void createCart()
//     } else {
//       // Cart ID exists in local storage, fetch the cart
//       const fetchCart = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_SERVER_URL}/api/cart/${localCart}`,
//           )
//           if (response.ok) {
//             const cartData = await response.json()
//             dispatchCart({
//               type: 'SET_CART',
//               payload: cartData,
//             })
//           } else {
//             console.error('Failed to fetch cart')
//           }
//         } catch (error) {
//           console.error('Error fetching cart:', error)
//         }
//       }

//       void fetchCart()
//     }
//   }
// }, [user])

//case 3: user, no local storage cart id
//case 4: user, local storage cart id

// authenticate the user and if logged in, merge the user's cart with local state
// only do this after we have initialized the cart to ensure we don't lose any items
// useEffect(() => {
//   if (!hasInitialized.current) return

//   if (authStatus === 'loggedIn') {
//     // merge the user's cart with the local state upon logging in
//     dispatchCart({
//       type: 'MERGE_CART',
//       payload: user?.cart,
//     })
//   }

//   if (authStatus === 'loggedOut') {
//     // clear the cart from local state after logging out
//     dispatchCart({
//       type: 'CLEAR_CART',
//     })
//   }
// }, [user, authStatus])

// Check local storage for a cart
// If there is a cart, fetch the products and hydrate the cart
// useEffect(() => {
//   // wait for the user to be defined before initializing the cart
//   if (user === undefined) return
//   if (!hasInitialized.current) {
//     hasInitialized.current = true

//     const syncCartFromLocalStorage = async () => {
//       const localCart = localStorage.getItem('cart')

//       const parsedCart = JSON.parse(localCart || '{}')

//       if (parsedCart?.items && parsedCart?.items?.length > 0) {
//         dispatchCart({
//           type: 'SET_CART',
//           payload: {
//             items: parsedCart.items,
//           },
//         })
//       } else {
//         dispatchCart({
//           type: 'SET_CART',
//           payload: {
//             items: [],
//           },
//         })
//       }
//     }

//     void syncCartFromLocalStorage()
//   }
// }, [user])

// every time the cart changes, determine whether to save to local storage or Payload based on authentication status
// upon logging in, merge and sync the existing local cart to Payload
// useEffect(() => {
//   // wait until we have attempted authentication (the user is either an object or `null`)
//   if (!hasInitialized.current || user === undefined || !cart.items) return

//   const flattenedCart = flattenCart(cart)

//   if (user) {
//     // prevent updating the cart when the cart hasn't changed
//     if (JSON.stringify(flattenCart(user.cart)) === JSON.stringify(flattenedCart)) {
//       setHasInitialized(true)
//       return
//     }

//     try {
//       const syncCartToPayload = async () => {
//         const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
//           // Make sure to include cookies with fetch
//           body: JSON.stringify({
//             cart: flattenedCart,
//           }),
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           method: 'PATCH',
//         })

//         if (req.ok) {
//           localStorage.setItem('cart', '[]')
//         }
//       }

//       void syncCartToPayload()
//     } catch (e) {
//       console.error('Error while syncing cart to Payload.') // eslint-disable-line no-console
//     }
//   } else {
//     localStorage.setItem('cart', JSON.stringify(cart))
//   }

//   hasInitialized.current = true
// }, [user, cart])
