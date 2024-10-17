// 'use client'

// import React, { useEffect, useState } from 'react'

// import type { Product } from '@/payload-types'
// import { AddToCartButton } from '@/components/shop/layout/add-to-cart'
// import { RemoveFromCartButton } from '@/components/shop/layout/remove-from-cart'
// import { priceFromJSON } from '@lib/utils/priceFromJSON'

// export const Price: React.FC<{
//   button?: 'addToCart' | 'removeFromCart' | false
//   product: Product
//   quantity?: number
// }> = (props) => {
//   const { button = 'addToCart', product, product: { priceJSON } = {}, quantity } = props

//   const [price, setPrice] = useState<{
//     actualPrice: string
//     withQuantity: string
//   }>(() => ({
//     actualPrice: priceFromJSON(priceJSON || ''),
//     withQuantity: priceFromJSON(priceJSON || '', quantity),
//   }))

//   useEffect(() => {
//     setPrice({
//       actualPrice: priceFromJSON(priceJSON || ''),
//       withQuantity: priceFromJSON(priceJSON || '', quantity),
//     })
//   }, [priceJSON, quantity])

//   return (
//     <div className="flex items-center flex-wrap gap-2 md:flex-col md:items-start">
//       {typeof price?.actualPrice !== 'undefined' && price?.withQuantity !== '' && (
//         <div className="font-semibold flex flex-col gap-1">
//           <p>{price?.withQuantity}</p>
//           {quantity && quantity > 1 && (
//             <small className="text-theme-elevation-500">{`${price.actualPrice} x ${quantity}`}</small>
//           )}
//         </div>
//       )}
//       {button && button === 'addToCart' && <AddToCartButton product={product} />}
//       {button && button === 'removeFromCart' && <RemoveFromCartButton product={product} />}
//     </div>
//   )
// }
