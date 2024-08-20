import { CartAction, CartItem, CartType } from '@/lib/types/cart'

export const cartReducer = (cart: CartType, action: CartAction): CartType => {
  switch (action.type) {
    case 'SET_CART': {
      console.log('Setting cart', action)
      return action.payload
    }

    case 'MERGE_CART': {
      console.log('Merging cart', action)
      const { payload: incomingCart } = action

      const syncedItems: CartItem[] = [
        ...(cart?.items || []),
        ...(incomingCart?.items || []),
      ].reduce((acc: CartItem[], item) => {
        // remove duplicates
        const productId = typeof item.product === 'string' ? item.product : item?.product?.id

        const indexInAcc = acc.findIndex(({ product }) =>
          typeof product === 'string' ? product === productId : product?.id === productId,
        ) // eslint-disable-line function-paren-newline

        if (indexInAcc > -1) {
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            // customize the merge logic here, e.g.:
            // quantity: acc[indexInAcc].quantity + item.quantity
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [])

      return {
        ...cart,
        items: syncedItems,
      }
    }

    /**
     * Handles adding an item to the cart or updating its quantity if it already exists.
     *
     * @param {CartAction} action - The action object containing the item to be added.
     * @returns {CartType} The updated cart state.
     */
    case 'ADD_ITEM': {
      const { payload: incomingItem } = action

      // Determine the product ID based on whether it's a string or an object
      const productId =
        typeof incomingItem.product === 'string' ? incomingItem.product : incomingItem?.product?.id

      // Get the variant ID if it exists
      const variantId = incomingItem.variant?.id

      // Find the index of the item in the cart, if it exists
      const indexInCart = cart?.items?.findIndex((item) =>
        typeof item.product === 'string'
          ? item.product === productId
          : item.product?.id === productId && item.variant?.id === variantId,
      )

      // Create a new array with the existing cart items
      const withAddedItem = [...(cart?.items || [])]

      if (indexInCart === -1) {
        // If the item is not in the cart, add it
        withAddedItem.push(incomingItem)
      } else if (typeof indexInCart === 'number' && indexInCart > -1) {
        // If the item is already in the cart, update its quantity
        withAddedItem[indexInCart] = {
          ...withAddedItem[indexInCart],
          quantity: (withAddedItem[indexInCart]?.quantity || 0) + (incomingItem.quantity || 1),
        }
      }

      // Return the updated cart state
      return {
        ...cart,
        items: withAddedItem,
      }
    }

    case 'DELETE_ITEM': {
      console.log('Deleting item from cart', action)
      const {
        payload: { product: incomingProduct, variantId },
      } = action
      const withDeletedItem = { ...cart }

      const indexInCart = cart?.items?.findIndex((item) =>
        typeof item.product === 'string'
          ? item.product === incomingProduct.id
          : item.product?.id === incomingProduct.id &&
            (variantId ? item.variant?.id === variantId : true),
      )

      if (typeof indexInCart === 'number' && withDeletedItem.items && indexInCart > -1)
        withDeletedItem.items.splice(indexInCart, 1)

      return withDeletedItem
    }

    case 'CLEAR_CART': {
      console.log('Clearing cart')
      return {
        ...cart,
        items: [],
      }
    }

    default: {
      return cart
    }
  }
}
