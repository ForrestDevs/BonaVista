// import type { Cart } from '@payload-types'
// import type { CartItem, CartAction } from '@lib/types/cart'

// export const cartReducer = (cart: Cart | null, action: CartAction): Cart => {
//   switch (action.type) {
//     case 'SET_CART': {
//       return action.payload
//     }

//     case 'MERGE_CART': {
//       const { payload: incomingCart } = action

//       const syncedItems: CartItem[] = [
//         ...(cart?.items || []),
//         ...(incomingCart?.items || []),
//       ].reduce((acc: CartItem[], item) => {
//         // remove duplicates
//         const productId =
//           item.id /* typeof item.product === 'string' ? item.product : item?.cproduct?.id */

//         const indexInAcc = acc.findIndex(
//           ({ id }) =>
//             /* typeof product === 'string' ? product === productId : product?.id === productId, */
//             id === productId,
//         ) // eslint-disable-line function-paren-newline

//         if (indexInAcc > -1) {
//           acc[indexInAcc] = {
//             ...acc[indexInAcc],
//             quantity: acc[indexInAcc].quantity + item.quantity,
//           }
//         } else {
//           acc.push(item)
//         }
//         return acc
//       }, [])

//       return {
//         ...cart,
//         items: syncedItems,
//       }
//     }

//     case 'ADD_ITEM': {
//       // if the item is already in the cart, increase the quantity
//       const { payload: incomingItem } = action
//       const productId =
//         typeof incomingItem.product === 'string' ? incomingItem.product : incomingItem?.product?.id

//       const indexInCart = cart?.items?.findIndex(({ product, variant }) => {
//         if (incomingItem.variant) {
//           return variant === incomingItem.variant
//         } else {
//           return typeof product === 'string' ? product === productId : product?.id === productId
//         }
//       }) // eslint-disable-line function-paren-newline

//       const withAddedItem = [...(cart?.items || [])]

//       if (indexInCart === -1) {
//         withAddedItem.push(incomingItem)
//       }

//       if (typeof indexInCart === 'number' && indexInCart > -1) {
//         withAddedItem[indexInCart] = {
//           ...withAddedItem[indexInCart],
//           quantity:
//             (incomingItem.quantity || 0) > 0
//               ? (withAddedItem[indexInCart].quantity || 0) + incomingItem.quantity
//               : undefined,
//         }
//       }

//       return {
//         ...cart,
//         items: withAddedItem,
//       }
//     }

//     case 'INCREMENT_QUANTITY': {
//       // if the item is already in the cart, increase the quantity
//       const { payload: itemId } = action

//       const incrementedItems = cart?.items?.map((item) => {
//         if (item.id === itemId) {
//           return {
//             ...item,
//             quantity: item.quantity + 1,
//           }
//         }
//         return item
//       })

//       return {
//         ...cart,
//         items: incrementedItems,
//       }
//     }

//     case 'DECREMENT_QUANTITY': {
//       // if the item is already in the cart, decrease the quantity
//       const { payload: itemId } = action

//       const incrementedItems = cart?.items?.reduce((items, item) => {
//         if (item.id === itemId) {
//           // Decrement the item if it has more than 1
//           if (item.quantity > 1) {
//             return [
//               ...items,
//               {
//                 ...item,
//                 quantity: item.quantity - 1,
//               },
//             ]
//           } else {
//             // otherwise remove it entirely from the cart if quantity reaches 0
//             return items
//           }
//         }
//         return [...items, item]
//       }, [])

//       return {
//         ...cart,
//         items: incrementedItems,
//       }
//     }

//     case 'DELETE_ITEM': {
//       const { payload: itemId } = action
//       const withDeletedItem = { ...cart }

//       const indexInCart = cart?.items?.findIndex(({ id }) => id === itemId) // eslint-disable-line function-paren-newline

//       if (typeof indexInCart === 'number' && withDeletedItem.items && indexInCart > -1)
//         withDeletedItem.items.splice(indexInCart, 1)

//       return withDeletedItem
//     }

//     case 'CLEAR_CART': {
//       return {
//         ...cart,
//         items: [],
//       }
//     }

//     case 'SET_SHIPPING_ADDRESS': {
//       const { payload: shippingAddress } = action
//       return {
//         ...cart,
//         shipping_address: shippingAddress,
//       }
//     }

//     case 'SET_BILLING_ADDRESS': {
//       const { payload: billingAddress } = action
//       return {
//         ...cart,
//         billing_address: billingAddress,
//       }
//     }

//     default: {
//       return cart
//     }
//   }
// }
