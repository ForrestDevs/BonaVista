'use server'

import getPayload from '@lib/utils/getPayload'
import type { Cart, Customer, User } from '@payload-types'
import { CART_SLUG, CUSTOMER_SLUG, USER_SLUG } from '@payload/collections/constants'

export async function getCustomer(customerId: string): Promise<Customer | null> {
  const payload = await getPayload()

  try {
    const customer = await payload.findByID({
      collection: CUSTOMER_SLUG,
      id: customerId,
    })

    return customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await payload.findByID({
      collection: CART_SLUG,
      id: cartId,
    })

    return cart
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export async function getFullUser(userId: string): Promise<User | null> {
  const payload = await getPayload()

  try {
    const user = await payload.findByID({
      collection: USER_SLUG,
      id: userId,
      depth: 10,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function fetchCartById(cartId: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const cart = await payload.findByID({
      collection: CART_SLUG,
      id: cartId,
    })

    return cart
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export async function createCart(): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const newCart = await payload.create({
      collection: CART_SLUG,
      data: {
        type: 'default',
        items: [],
      },
    })

    return newCart
  } catch (error) {
    console.error('Error creating cart:', error)
    return null
  }
}

export async function createCartWithCustomer(customerId: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const newCart = await payload.create({
      collection: CART_SLUG,
      data: {
        type: 'default',
        customer: customerId,
      },
    })

    return newCart
  } catch (error) {
    console.error('Error creating cart with customer:', error)
    return null
  }
}

export async function updateCart(cartId: string, data: Partial<Cart>): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    console.log('Updating cart:', cartId, data)
    const updatedCart = await payload.update({
      collection: CART_SLUG,
      id: cartId,
      data: {
        ...data,
        items: data.items.map((item) => {
          let productID
          if (typeof item.product === 'string') {
            productID = item.product
          } else {
            productID = item.product.id
          }
          return {
            product: productID,
            variant: item.variant,
            quantity: item.quantity,
          }
        }),
      },
    })
    console.log('Updated cart:', updatedCart.id)

    return updatedCart
  } catch (error) {
    console.error('Error updating cart:', error)
    return null
  }
}

export async function deleteCart(cartId: string): Promise<Cart | null> {
  const payload = await getPayload()

  try {
    const deletedCart = await payload.delete({
      collection: CART_SLUG,
      id: cartId,
    })

    return deletedCart
  } catch (error) {
    console.error('Error deleting cart:', error)
    return null
  }
}
