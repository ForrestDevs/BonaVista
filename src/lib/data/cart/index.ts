'use server'

import { getCustomer } from '../customer'
import { CartItem } from '@lib/types/cart'
import getPayload from '@lib/utils/getPayload'
import { Address, Cart } from '@payload-types'
import { CART_SLUG, CUSTOMER_SLUG } from '@payload/collections/constants'
import { getCartCookie, removeCartCookie, setCartCookie } from '@lib/data/cookies'
import { revalidateTag } from 'next/cache'
import { createPaymentIntent } from '@/lib/data/shop'

export async function returnOrCreateCart(cart: Cart | null, customerId?: string): Promise<Cart> {
  if (cart) {
    return cart
  } else {
    const newCart = await createCart(customerId)
    return newCart
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

  const paymentIntent = await createPaymentIntent()

  try {
    const cart = await payload.create({
      collection: CART_SLUG,
      data: {
        type: 'default',
        ...(customerId ? { customer: customerId } : {}),
        payment_intent: paymentIntent as any,
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

export async function getCartById(id: string, depth?: number): Promise<Cart | null> {
  const payload = await getPayload()
  console.log('getCartById', id)
  try {
    const cart = await payload.findByID({
      collection: CART_SLUG,
      id,
      depth: depth ?? 1,
    })
    return cart
  } catch (error) {
    console.log('error getting cart by id', error)
    return null
  }
}

export async function getCart(depth?: number): Promise<Cart | null> {
  const customer = await getCustomer()
  if (customer) {
    console.log('found customer cart')
    const cartId = typeof customer.cart === 'string' ? customer.cart : customer.cart?.id
    console.log('cartId', cartId)
    const cart = await getCartById(cartId, depth)
    return structuredClone(cart)
  }
  const cartId = (await getCartCookie())?.id
  if (cartId) {
    const cart = await getCartById(cartId, depth)
    return structuredClone(cart)
  }
  return null
}

export async function getOrSetCart(): Promise<Cart> {
  const customer = await getCustomer()
  if (customer) {
    console.log('found customer')
    if (customer.cart) {
      const cartID = typeof customer.cart === 'string' ? customer.cart : customer.cart?.id
      const cart = await getCartById(cartID)
      return structuredClone(cart) // No need for returnOrCreateCart, cart should already exist
    } else {
      const newCart = await returnOrCreateCart(null, customer.id)
      return structuredClone(newCart)
    }
  } else {
    console.log('no customer')
    const cartId = (await getCartCookie())?.id
    console.log('cartId', cartId)
    if (cartId) {
      const cart = await getCartById(cartId)
      if (cart) {
        console.log('cart found in cookie')
        return structuredClone(cart) // No need for returnOrCreateCart, cart should already exist
      } else {
        console.log('cart was deleted creating new cart')
        // Handle case where the cart was deleted
        const newCart = await returnOrCreateCart(null)
        await setCartCookie({ id: newCart.id, linesCount: newCart.items.length })
        revalidateTag(`cart-${newCart.id}`)
        return structuredClone(newCart)
      }
    } else {
      console.log('creating new cart')
      const newCart = await returnOrCreateCart(null)
      await setCartCookie({ id: newCart.id, linesCount: newCart.items.length })
      revalidateTag(`cart-${newCart.id}`)
      return structuredClone(newCart)
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

  console.log('merging carts')
  console.log('guestCart', guestCart !== null)
  console.log('customerCart', customerCart !== null)

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
      // removeCartCookie()
    } catch (error) {
      console.error('Error deleting guest cart', error)
      throw error
    }

    await setCartCookie({ id: customerCart.id, linesCount: customerCart.items.length })
    revalidateTag(`cart-${customerCart.id}`)

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

      await setCartCookie({ id: updatedGuestCart.id, linesCount: updatedGuestCart.items.length })
      revalidateTag(`cart-${updatedGuestCart.id}`)

      // removeCartCookie()

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
  console.log('productId', productId)

  // Find the index of the item in the cart that matches the new item
  // This checks both the product ID and variant (if applicable)
  const existingItemIndex = cart.items.findIndex(({ product: existingProduct, variant }) => {
    const existingProductId =
      typeof existingProduct === 'string' ? existingProduct : existingProduct?.id
    const existingVariantOptions = variant?.map((v) => v.option).sort() || []
    const newVariantOptions = cartItem.variant?.map((v) => v.option).sort() || []
    return (
      existingProductId === productId &&
      JSON.stringify(existingVariantOptions) === JSON.stringify(newVariantOptions)
    )
  })

  // Create a new array of cart items to avoid mutating the original cart
  let updatedCartItems = [
    ...cart.items.map((item) => ({
      ...item,
    })),
  ]

  if (existingItemIndex !== -1) {
    console.log('item already exists in cart', existingItemIndex)
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
    console.log('item does not exist in cart, adding it')
    // If the item doesn't exist in the cart, add it as a new item
    updatedCartItems.push({
      id: cartItem.id,
      product: productId,
      price: cartItem.price,
      variant: cartItem.variant,
      isVariant: cartItem.isVariant,
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

  if (updatedCart) {
    await setCartCookie({
      id: updatedCart.id,
      linesCount: updatedCart.items.length,
    })

    revalidateTag(`cart-${updatedCart.id}`)
  }

  return updatedCart
}

export async function deleteCartItem(options: {
  cartItemId?: string
  cartItem?: CartItem
}): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  let updatedCartItems = []

  if (options.cartItemId) {
    updatedCartItems = cart.items.filter((item) => item.id !== options.cartItemId)
  } else {
    const { product, variant } = options.cartItem
    const productId = typeof product === 'string' ? product : product?.id
    const variantOptions = variant?.map((v) => v.option).sort() || []

    updatedCartItems = cart.items.filter((item) => {
      const itemProductId = typeof item.product === 'string' ? item.product : item.product?.id
      // If variant is provided, only delete items matching both ID and variant options
      if (options.cartItem?.variant) {
        console.log('deleting variant')
        console.log('item id:', itemProductId, 'cartItem id:', productId)
        const existingVariantOptions = item.variant?.map((v) => v.option) || []
        console.log('existingVariantOptions', existingVariantOptions)
        console.log('newVariantOptions', variantOptions)

        console.log(
          'item.product.id === cartItem.product.id',
          itemProductId === productId,
          JSON.stringify(existingVariantOptions) === JSON.stringify(variantOptions),
        )

        return !(
          itemProductId === productId &&
          JSON.stringify(existingVariantOptions) === JSON.stringify(variantOptions)
        )
      }
      console.log('no variant, deleting item', itemProductId, productId)
      // If no variant, just filter by ID
      return itemProductId !== productId
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

  if (updatedCart) {
    await setCartCookie({
      id: updatedCart.id,
      linesCount: updatedCart.items.length,
    })

    revalidateTag(`cart-${updatedCart.id}`)
  }

  return updatedCart
}

export async function updateCartItemQuantity(quantity: number, cartItemId: string): Promise<Cart> {
  console.log('updating cart item quantity', quantity, cartItemId)
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  const updatedCartItems = cart.items.map((item) => {
    if (item.id === cartItemId) {
      return { ...item, quantity }
    }
    return item
  })

  const updatedCart = await payload.update({
    collection: CART_SLUG,
    id: cart.id,
    data: {
      items: updatedCartItems,
    },
  })

  console.log('updatedCart', updatedCart)

  return updatedCart
}

export async function increaseCartItemQuantity(
  quantity: number,
  options: { cartItemId: string } | { cartItem: Omit<CartItem, 'quantity'> },
): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  let updatedCartItems: CartItem[] = []

  if ('cartItemId' in options) {
    // Find the cart item
    const foundCartItem = cart.items.find((item) => item.id === options.cartItemId)

    if (!foundCartItem) {
      throw new Error('Cart item not found')
    }

    // Update the quantity
    updatedCartItems = cart.items.map((item) => {
      if (item.id === options.cartItemId) {
        return {
          ...item,
          product: typeof item.product === 'string' ? item.product : item.product?.id,
          quantity: item.quantity + quantity,
        }
      }
      return item
    })
  } else {
    const { product, variant } = options.cartItem
    const productId = typeof product === 'string' ? product : product?.id
    const variantOptions = variant?.map((v) => v.option).sort() || []

    updatedCartItems = cart.items.map((item) => {
      const { product: existingProduct, variant: existingVariant } = item
      const existingProductId =
        typeof existingProduct === 'string' ? existingProduct : existingProduct?.id
      const existingVariantOptions = existingVariant?.map((v) => v.option).sort() || []

      if (
        existingProductId === productId &&
        (!variant || JSON.stringify(existingVariantOptions) === JSON.stringify(variantOptions))
      ) {
        return {
          ...item,
          quantity: item.quantity + quantity,
        }
      }
      return item
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

export async function decreaseCartItemQuantity(
  quantity: number,
  options: { cartItemId: string } | { cartItem: Omit<CartItem, 'quantity'> },
): Promise<Cart> {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  let updatedCartItems: CartItem[] = []

  if ('cartItemId' in options) {
    // Find the cart item
    const foundCartItem = cart.items.find((item) => item.id === options.cartItemId)

    if (!foundCartItem) {
      throw new Error('Cart item not found')
    }

    // Update the quantity
    updatedCartItems = cart.items.map((item) => {
      if (item.id === options.cartItemId) {
        const newQuantity = Math.max(0, item.quantity - quantity)
        if (newQuantity === 0) {
          return null
        } else {
          return {
            ...item,
            product: typeof item.product === 'string' ? item.product : item.product?.id,
            quantity: newQuantity,
          }
        }
      }
      return item
    })
  } else {
    const { product, variant } = options.cartItem
    const productId = typeof product === 'string' ? product : product?.id
    const variantOptions = variant?.map((v) => v.option).sort() || []

    updatedCartItems = cart.items.map((item) => {
      const { product: existingProduct, variant: existingVariant } = item
      const existingProductId =
        typeof existingProduct === 'string' ? existingProduct : existingProduct?.id
      const existingVariantOptions = existingVariant?.map((v) => v.option).sort() || []

      if (
        existingProductId === productId &&
        (!variant || JSON.stringify(existingVariantOptions) === JSON.stringify(variantOptions))
      ) {
        const newQuantity = Math.max(0, item.quantity - quantity)
        if (newQuantity === 0) {
          return null
        } else {
          return {
            ...item,
            quantity: newQuantity,
          }
        }
      }
      return item
    })
  }

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

  if (updatedCart) {
    await setCartCookie({
      id: updatedCart.id,
      linesCount: updatedCart.items.length,
    })

    revalidateTag(`cart-${updatedCart.id}`)
  }

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

  if (updatedCart) {
    await setCartCookie({
      id: updatedCart.id,
      linesCount: updatedCart.items.length,
    })

    revalidateTag(`cart-${updatedCart.id}`)
  }

  return updatedCart
}

export async function deleteCart() {
  const payload = await getPayload()
  const cart = await getOrSetCart() // Get the current cart

  if (!cart) {
    throw new Error('Error retrieving or creating cart')
  }

  await payload.delete({
    collection: CART_SLUG,
    id: cart.id,
  })

  await removeCartCookie()
  revalidateTag(`cart-${cart.id}`)
  revalidateTag('admin-orders')
}
