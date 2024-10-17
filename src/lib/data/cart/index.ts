'use server'

import { getCustomer } from '../customer'
import { CartItem } from '@lib/types/cart'
import getPayload from '@lib/utils/getPayload'
import { Address, Cart } from '@payload-types'
import { CART_SLUG, CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCartCookie, removeCartCookie, setCartCookie } from '@lib/data/cookies'

export async function returnOrCreateCart(cart: Cart | null, customerId?: string): Promise<Cart> {
  if (cart) {
    return cart
  } else {
    const newCart = await createCart(customerId)
    return newCart
  }
}

export async function getGuestCart(): Promise<Cart | null> {
  const cartId = await getCartCookie()
  if (cartId) {
    const cart = await getCartById(cartId)
    return cart
  }
  return null
}

export async function getCustomerCart(customerId: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const { docs } = await payload.find({
      collection: CART_SLUG,
      where: {
        customer: {
          equals: customerId,
        },
      },
    })

    if (docs.length === 0) {
      return null
    }

    return docs[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createCart(customerId?: string): Promise<Cart> {
  const payload = await getPayload()

  try {
    const cart = await payload.create({
      collection: CART_SLUG,
      data: {
        type: 'default',
        ...(customerId ? { customer: customerId } : {}),
      },
    })
    console.log('created cart', cart.id)
    if (customerId) {
      console.log('updating customer cart', customerId)
      const updatedCustomer = await payload.update({
        collection: CUSTOMER_SLUG,
        id: customerId,
        data: {
          cart: cart.id,
        },
      })
      console.log('updated customer', updatedCustomer.id)
    }
    return cart
  } catch (error) {
    throw Error('Error creating cart', error)
  }
}

export async function getCartById(id: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await payload.findByID({
      collection: CART_SLUG,
      id,
      depth: 1,
    })
    return cart
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getCart(): Promise<Cart | null> {
  const customer = await getCustomer()
  if (customer) {
    const cartId = typeof customer.cart === 'string' ? customer.cart : customer.cart?.id
    const cart = await getCartById(cartId)
    return cart
  }
  const cartId = await getCartCookie()
  if (cartId) {
    const cart = await getCartById(cartId)
    return cart
  }
  return null
}

export async function getOrSetCart(): Promise<Cart> {
  const customer = await getCustomer()
  if (customer) {
    if (customer.cart) {
      const cartID = typeof customer.cart === 'string' ? customer.cart : customer.cart?.id
      const cart = await getCartById(cartID)
      return cart // No need for returnOrCreateCart, cart should already exist
    } else {
      const newCart = await returnOrCreateCart(null, customer.id)
      return newCart
    }
  } else {
    const cartId = await getCartCookie()
    if (cartId) {
      const cart = await getCartById(cartId)
      if (cart) {
        return cart // No need for returnOrCreateCart, cart should already exist
      } else {
        // Handle case where the cart was deleted
        const newCart = await returnOrCreateCart(null)
        setCartCookie(newCart.id)
        return newCart
      }
    } else {
      const newCart = await returnOrCreateCart(null)
      setCartCookie(newCart.id)
      return newCart
    }
  }
}

function mergeItems(guestCart: Cart, customerCart: Cart): CartItem[] {
  const syncedItems: CartItem[] = [
    ...(guestCart?.items.map((item) => ({
      ...item,
      product: typeof item.product === 'string' ? item.product : item.product?.id,
    })) || []),
    ...(customerCart?.items.map((item) => ({
      ...item,
      product: typeof item.product === 'string' ? item.product : item.product?.id,
    })) || []),
  ].reduce((acc: CartItem[], item) => {
    const indexInAcc = acc.findIndex(({ id }) => id === item.id)

    if (indexInAcc > -1) {
      acc[indexInAcc] = {
        ...acc[indexInAcc],
        quantity: acc[indexInAcc].quantity + item.quantity,
      }
    } else {
      acc.push(item)
    }
    return acc
  }, [])

  return syncedItems
}

export async function mergeCarts(customerId: string): Promise<Cart> {
  const [payload, guestCart, customerCart] = await Promise.all([
    getPayload(),
    getGuestCart(),
    getCustomerCart(customerId),
  ])

  if (guestCart && customerCart) {
    const mergedItems = mergeItems(guestCart, customerCart)

    try {
      console.log('merging customer cart with guest cart')
      // Update customer's cart in the database
      await payload.update({
        collection: CART_SLUG,
        id: customerCart.id,
        data: {
          items: mergedItems,
        },
      })
    } catch (error) {
      console.error('Error updating customer cart', error)
      throw error
    }

    try {
      console.log('deleting guest cart', guestCart.id)
      // Delete the guest cart
      await payload.delete({
        collection: CART_SLUG,
        id: guestCart.id,
      })
      removeCartCookie()
    } catch (error) {
      console.error('Error deleting guest cart', error)
      throw error
    }

    return customerCart
  } else if (guestCart && !customerCart) {
    // Associate guest cart with customer
    try {
      const updatedGuestCart = await payload.update({
        collection: CART_SLUG,
        id: guestCart.id,
        data: { customer: customerId },
      })

      const updatedCustomer = await payload.update({
        collection: CUSTOMER_SLUG,
        id: customerId,
        data: { cart: updatedGuestCart.id },
      })

      removeCartCookie()

      return updatedGuestCart
    } catch (error) {
      console.error('Error associating guest cart with customer', error)
      throw error
    }
  } else if (customerCart && !guestCart) {
    // Customer already has a cart, no need to merge
    return customerCart
  } else {
    console.log('creating new cart for customer', customerId)
    // Both carts are null, this should only happen if a user registers with an empty cart
    // In this case, we create a new cart for the customer
    return createCart(customerId)
  }
}

export async function addToCart(cartItem: CartItem): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get or create the appropriate cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  const { product } = cartItem
  const productId = typeof product === 'string' ? product : product?.id

  // Find the index of the item in the cart that matches the new item
  // This checks both the product ID and variant (if applicable)
  const existingItemIndex = cart.items.findIndex(
    ({ product: existingProduct, variant }) =>
      cartItem.variant
        ? variant === cartItem.variant // If the new item has a variant, match on variant
        : (typeof existingProduct === 'string' ? existingProduct : existingProduct?.id) ===
          productId, // Otherwise, match on product ID
  )

  // Create a new array of cart items to avoid mutating the original cart
  let updatedCartItems = [
    ...cart.items.map((item) => ({
      ...item,
      product: typeof item.product === 'string' ? item.product : item.product?.id,
    })),
  ]

  if (existingItemIndex !== -1) {
    // If the item already exists in the cart
    updatedCartItems[existingItemIndex] = {
      ...updatedCartItems[existingItemIndex], // Spread existing item properties
      quantity: Math.max(
        0, // Ensure quantity is never negative
        (updatedCartItems[existingItemIndex].quantity || 0) + // Current quantity (default to 0 if undefined)
          (cartItem.quantity || 0), // New quantity to add (default to 0 if undefined)
      ),
    }
  } else {
    // If the item doesn't exist in the cart, add it as a new item
    updatedCartItems.push({
      id: cartItem.id,
      product: productId,
      variant: cartItem.variant,
      quantity: Math.max(0, cartItem.quantity || 0), // Ensure quantity is never negative
    })
  }

  // Update the cart in the database
  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: updatedCartItems,
    },
  })

  return updatedCart
}

export async function deleteCartItem(cartItemId: string): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  const updatedCartItems = cart.items.filter((item) => item.id !== cartItemId)

  // Update the cart in the database
  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: updatedCartItems,
    },
  })

  return updatedCart
}

export async function increaseCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  // Find the cart item
  const cartItem = cart.items.find((item) => item.id === cartItemId)

  if (!cartItem) {
    throw new Error('Cart item not found')
  }

  // Update the quantity
  const updatedCartItems = cart.items.map((item) => {
    if (item.id === cartItemId) {
      return {
        ...item,
        product: typeof item.product === 'string' ? item.product : item.product?.id,
        quantity: item.quantity + quantity,
      }
    }
    return item
  })

  // Update the cart in the database
  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: updatedCartItems,
    },
  })

  return updatedCart
}

export async function decreaseCartItemQuantity(cartItemId: string): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  // Find the cart item
  const cartItem = cart.items.find((item) => item.id === cartItemId)

  if (!cartItem) {
    throw new Error('Cart item not found')
  }

  // Update the quantity
  const updatedCartItems = cart.items.map((item) => {
    if (item.id === cartItemId) {
      // Decrement the item if it has more than quantity
      if (item.quantity > 1) {
        return {
          ...item,
          product: typeof item.product === 'string' ? item.product : item.product?.id,
          quantity: item.quantity - 1,
        }
      } else {
        // Otherwise remove it entirely from the cart
        return null
      }
    }
    return item
  })

  // Filter out null items
  const filteredUpdatedCartItems = updatedCartItems.filter((item) => item !== null) as CartItem[]

  // Update the cart in the database
  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: filteredUpdatedCartItems,
    },
  })

  return updatedCart
}

export async function clearCart(): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  // Update the cart in the database
  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: [],
    },
  })

  return updatedCart
}

export async function setShippingAddress(address: Address) {
  const payload = await getPayload()
  const cart = await getOrSetCart()

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      shipping_address: address,
    },
  })

  return updatedCart
}

export async function setBillingAddress(address: Address) {
  const payload = await getPayload()
  const cart = await getOrSetCart()

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      billing_address: address,
    },
  })

  return updatedCart
}
