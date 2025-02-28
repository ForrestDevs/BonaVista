'use server'

import { getCustomer } from '../customer'
import { CartItem } from '@lib/types/cart'
import getPayload from '@lib/utils/getPayload'
import { Cart } from '@payload-types'
import { CART_SLUG, CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCartCookie, setCartCookie } from '@lib/data/cookies'
import { revalidateTag } from 'next/cache'
import { cache } from '@/lib/utils/cache'

export async function returnOrCreateCart(
  cart: Cart | null,
  customerId?: number,
): Promise<Cart | null> {
  if (cart) {
    return cart
  } else {
    try {
      const newCart = await createCart(customerId)
      return newCart
    } catch (error) {
      console.error('Error creating cart', error)
      return null
    }
  }
}

export async function getGuestCart(): Promise<Cart | null> {
  const cartId = (await getCartCookie())?.id
  if (cartId) {
    const cart = await getCartById(cartId)
    return cart
  }
  return null
}

export async function getCustomerCart(customerId: number): Promise<Cart | null> {
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

export async function createCart(customerId?: number): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await payload.create({
      collection: CART_SLUG,
      data: {
        ...(customerId ? { customer: customerId } : {}),
      },
    })
    if (customerId) {
      await payload.update({
        collection: CUSTOMER_SLUG,
        id: customerId,
        data: {
          cart: cart.id,
        },
        select: {},
      })
    }
    return cart
  } catch (error) {
    console.error('Error creating cart', error)
    return null
  }
}

/**
 * Retrieves a cart by its ID from the cache or database.
 *
 * @param id The ID of the cart to retrieve.
 * @param depth Optional depth parameter for payload query to control relation population.
 * @returns A Promise that resolves to the cart object if found, null otherwise.
 */
export const getCartById = cache(
  async (id: number, depth?: number): Promise<Cart | null> => {
    const payload = await getPayload()
    try {
      const cart = await payload.findByID({
        collection: CART_SLUG,
        id,
        depth: depth ?? 1,
      })
      return cart
    } catch (error) {
      return null
    }
  },
  {
    tags: (id) => [`cart-${id}`], // Tags the cache with the cart ID for easy invalidation.
    revalidate: 3600, // Revalidates the cache every 3600 seconds (1 hour).
  },
)
/**
 * Retrieves the current cart for either a logged-in customer or guest user
 * @param depth Optional depth parameter for payload query to control relation population
 * @returns The cart object if found, null otherwise
 *
 * For logged-in customers, retrieves cart from their customer record
 * For guest users, retrieves cart ID from cookie and loads cart
 * Returns structuredClone of cart to avoid mutation
 */
export async function getCart(depth?: number): Promise<Cart | null> {
  const customer = await getCustomer()
  if (customer) {
    const cartId = typeof customer.cart === 'object' ? customer.cart?.id : customer.cart
    const cart = await getCartById(cartId, depth)
    if (!cart) {
      return null
    }
    return structuredClone(cart)
  } else {
    const cartId = (await getCartCookie())?.id
    if (!cartId) {
      return null
    }
    const cart = await getCartById(cartId, depth)
    if (!cart) {
      return null
    }
    return structuredClone(cart)
  }
}

export async function getOrSetCart(): Promise<Cart | null> {
  const customer = await getCustomer()
  if (customer) {
    if (customer.cart) {
      const cartID = typeof customer.cart === 'object' ? customer.cart?.id : customer.cart
      const cart = await getCartById(cartID)
      if (!cart) {
        return null
      }
      return structuredClone(cart)
    } else {
      const newCart = await returnOrCreateCart(null, customer.id)
      if (!newCart) {
        return null
      }
      return structuredClone(newCart)
    }
  } else {
    const cartId = (await getCartCookie())?.id
    if (cartId) {
      const cart = await getCartById(cartId)
      if (!cart) {
        return null
      }
      return structuredClone(cart)
    } else {
      const newCart = await returnOrCreateCart(null)
      if (!newCart) {
        return null
      }
      await setCartCookie({ id: newCart.id, linesCount: newCart.lineItems.length })
      return structuredClone(newCart)
    }
  }
}

function mergeItems(guestCart: Cart, customerCart: Cart): CartItem[] {
  // Extract line items from both carts and convert to CartItem format
  const guestItems =
    guestCart?.lineItems?.map(({ lineItem, id }) => ({
      lineItem: {
        ...lineItem,
        product: typeof lineItem.product === 'object' ? lineItem.product?.id : lineItem.product,
      },
      id,
    })) || []

  const customerItems =
    customerCart?.lineItems?.map(({ lineItem, id }) => ({
      lineItem: {
        ...lineItem,
        product: typeof lineItem.product === 'object' ? lineItem.product?.id : lineItem.product,
      },
      id,
    })) || []

  // Combine and merge items with the same ID
  const mergedItems = [...guestItems, ...customerItems].reduce((acc: typeof guestItems, item) => {
    const indexInAcc = acc.findIndex((accItem) => accItem.id === item.id)

    if (indexInAcc > -1) {
      acc[indexInAcc] = {
        ...acc[indexInAcc],
        lineItem: {
          ...acc[indexInAcc].lineItem,
          quantity: acc[indexInAcc].lineItem.quantity + item.lineItem.quantity,
        },
      }
    } else {
      acc.push(item)
    }
    return acc
  }, [])

  return mergedItems
}

/**
 * Merges a guest cart with a customer cart.
 *
 * This function:
 * 1. Retrieves the current guest and customer carts
 * 2. Merges the items from the guest cart into the customer cart
 * 3. Deletes the guest cart
 * 4. Updates the customer cart in the database
 * 5. Sets the cart cookie to the updated customer cart
 * 6. Revalidates the cart cache
 *
 * @param customerId The ID of the customer to merge the cart with
 * @returns The updated customer cart or null if an error occurs
 */
export async function mergeCarts(customerId: number): Promise<Cart | null> {
  const [payload, guestCart, customerCart] = await Promise.all([
    getPayload(),
    getGuestCart(),
    getCustomerCart(customerId),
  ])

  try {
    if (guestCart && customerCart) {
      const mergedItems = mergeItems(guestCart, customerCart)
      // Update customer's cart in the database
      const updatedCustomerCart = await payload.update({
        collection: CART_SLUG,
        id: customerCart.id,
        data: {
          lineItems: mergedItems,
        },
      })
      if (!updatedCustomerCart) {
        throw 'Error updating customer cart'
      }
      // Delete the guest cart
      await payload.delete({
        collection: CART_SLUG,
        id: guestCart.id,
      })

      await setCartCookie({ id: customerCart.id, linesCount: customerCart.lineItems.length })
      revalidateTag(`cart-${customerCart.id}`)

      return updatedCustomerCart
    } else if (guestCart && !customerCart) {
      // Associate guest cart with customer
      const updatedGuestCart = await payload.update({
        collection: CART_SLUG,
        id: guestCart.id,
        data: { customer: customerId },
      })

      if (!updatedGuestCart) {
        throw 'Error associating guest cart with customer'
      }

      await payload.update({
        collection: CUSTOMER_SLUG,
        id: customerId,
        data: { cart: updatedGuestCart.id },
      })

      await setCartCookie({
        id: updatedGuestCart.id,
        linesCount: updatedGuestCart.lineItems.length,
      })
      revalidateTag(`cart-${updatedGuestCart.id}`)

      return updatedGuestCart
    } else if (customerCart && !guestCart) {
    } else if (customerCart && !guestCart) {
      // Customer already has a cart, no need to merge
      return customerCart
    } else {
      // Both carts are null, this should only happen if a user registers with an empty cart
      // In this case, we create a new cart for the customer
      return null
    }
  } catch (error) {
    console.error('Error merging carts', error)
    return null
  }
}
/**
 * Adds an item to the cart.
 *
 * This function:
 * 1. Gets or creates the appropriate cart
 * 2. Finds the index of the item in the cart that matches the new item
 * 3. Updates the quantity of the item if it already exists
 * 4. Adds the item to the cart if it doesn't exist
 * 5. Updates the cart in the database
 * 6. Sets the cart cookie to the updated cart
 * 7. Revalidates the cart cache
 *
 * @param cartItem The item to add to the cart
 * @returns The updated cart or null if an error occurs
 */
export async function addToCart(cartItem: CartItem): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await getOrSetCart() // Get or create the appropriate cart

    if (!cart) {
      throw 'Error retrieving or creating cart'
    }

    const { product } = cartItem.lineItem
    const productId = typeof product === 'object' ? product?.id : product

    // Find the index of the item in the cart that matches the new item
    // We can simply compare SKUs as they uniquely identify products and their variants
    const existingItemIndex = cart.lineItems.findIndex(({ lineItem }) => {
      return lineItem.sku === cartItem.lineItem.sku
    })

    // Create a new array of cart items to avoid mutating the original cart
    let updatedCartItems = [
      ...cart.lineItems.map((item) => ({
        ...item,
      })),
    ]

    // The item already exists in the cart
    if (existingItemIndex !== -1) {
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex], // Spread existing item properties
        lineItem: {
          ...updatedCartItems[existingItemIndex].lineItem,
          quantity: Math.max(
            0, // Ensure quantity is never negative
            (updatedCartItems[existingItemIndex].lineItem.quantity || 0) + // Current quantity (default to 0 if undefined)
              (cartItem.lineItem.quantity || 0), // New quantity to add (default to 0 if undefined)
          ),
        },
      }
    } else {
      updatedCartItems.push({
        id: cartItem.id,
        lineItem: {
          ...cartItem.lineItem,
          product: productId,
        },
      })
    }

    // Update the cart in the database
    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cart.id,
      data: {
        subtotal: updatedCartItems.reduce(
          (acc, item) => acc + item.lineItem.price * item.lineItem.quantity,
          0,
        ),
        lineItems: updatedCartItems,
      },
    })
    if (updatedCart) {
      await setCartCookie({
        id: updatedCart.id,
        linesCount: updatedCart.lineItems.length,
      })

      revalidateTag(`cart-${updatedCart.id}`)
    }

    return updatedCart
  } catch (error) {
    console.error('Error adding item to cart', error)
    return null
  }
}
/**
 * Deletes an item from the current cart.
 *
 * This function:
 * 1. Retrieves the current cart
 * 2. Deletes the item from the cart
 * 3. Sets the cart cookie to the updated cart
 * 4. Revalidates the cart cache
 *
 * @param cartItemId The ID of the item to delete
 * @param cartItem The item to delete
 *
 * @returns The updated cart or null if an error occurs
 */
export async function deleteCartItem({
  cartItemId,
  cartItem,
}: {
  cartItemId?: string
  cartItem?: CartItem
}): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    if (!cartItemId && !cartItem) {
      throw 'No cart item ID or cart item provided'
    }
    const cart = await getCart() // Get the current cart

    if (!cart) {
      throw 'No cart found'
    }

    let updatedCartItems = []

    if (cartItemId) {
      updatedCartItems = cart.lineItems.filter((item) => item.id !== cartItemId)
    } else {
      // Use SKU for simpler comparison - SKU is unique for each product variant combination
      const { sku } = cartItem.lineItem

      updatedCartItems = cart.lineItems.filter((item) => {
        // Keep all items that don't match the SKU we're trying to remove
        return item.lineItem.sku !== sku
      })
    }

    // Update the cart in the database
    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cart.id,
      data: {
        subtotal: updatedCartItems.reduce(
          (acc, item) => acc + item.lineItem.price * item.lineItem.quantity,
          0,
        ),
        lineItems: updatedCartItems,
      },
    })

    if (updatedCart) {
      await setCartCookie({
        id: updatedCart.id,
        linesCount: updatedCart.lineItems.length,
      })

      revalidateTag(`cart-${updatedCart.id}`)
    }

    return updatedCart
  } catch (error) {
    console.error('Error deleting cart item', error)
    return null
  }
}
/**
 * Updates the quantity of an item in the current cart.
 *
 * This function:
 * 1. Retrieves the current cart
 * 2. Updates the quantity of the specified item
 * 3. Sets the cart cookie to the updated cart
 * 4. Revalidates the cart cache
 *
 * @returns The updated cart or null if an error occurs
 */
export async function updateCartItemQuantity(
  quantity: number,
  cartItemId: string,
): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await getCart()

    if (!cart) {
      throw 'No cart found'
    }

    const updatedCartItems = cart.lineItems.map((item) => {
      if (item.id === cartItemId) {
        return { ...item, lineItem: { ...item.lineItem, quantity } }
      }
      return item
    })

    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cart.id,
      data: {
        subtotal: updatedCartItems.reduce(
          (acc, item) => acc + item.lineItem.price * item.lineItem.quantity,
          0,
        ),
        lineItems: updatedCartItems,
      },
    })

    revalidateTag(`cart-${updatedCart.id}`)
    return updatedCart
  } catch (error) {
    console.error('Error updating cart item quantity', error)
    return null
  }
}
/**
 * Clears the items from the current cart.
 *
 * This function:
 * 1. Retrieves the current cart
 * 2. Updates the cart to have no items
 * 3. Sets the cart cookie to have no items
 * 4. Revalidates the cart cache
 *
 * @returns The updated cart
 */
export async function clearCartItems(): Promise<Cart> {
  const payload = await getPayload()
  try {
    const cart = await getCart() // Get the current cart

    if (!cart) {
      throw 'No cart found'
    }

    // Update the cart in the database
    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cart.id,
      data: {
        lineItems: [],
      },
    })

    if (updatedCart) {
      await setCartCookie({
        id: updatedCart.id,
        linesCount: updatedCart.lineItems.length,
      })

      revalidateTag(`cart-${updatedCart.id}`)
    }

    return updatedCart
  } catch (error) {
    console.error('Error clearing cart items', error)
    return null
  }
}
/**
 * Deletes the cart with the given ID from the database.
 *
 * This function:
 * 1. Deletes the cart from the database
 * 2. Revalidates the cart cache
 *
 */
export async function deleteCart(cartId: number) {
  const payload = await getPayload()

  try {
    await payload.delete({
      collection: CART_SLUG,
      id: cartId,
    })
  } catch (error) {
    console.error('Error deleting cart', error)
  }
}
