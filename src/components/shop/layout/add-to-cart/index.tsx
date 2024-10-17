// 'use client'

// import React, { Fragment, useEffect, useState } from 'react'

// import { useRouter } from 'next/navigation'
// import type { Product } from '@payload-types'
// import { useCart } from '@lib/providers/Cart'
// import { Button } from '@components/ui/button'
// import { cn } from '@lib/utils/cn'
// import { ShoppingCartIcon } from 'lucide-react'
// import { Input } from '@components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@components/ui/select'
// import { ProductVariant } from '@lib/types/product'

// export const AddToCartButton: React.FC<{
//   className?: string
//   product: Product
// }> = (props) => {
//   const router = useRouter()
//   const { className, product } = props
//   const [isInCart, setIsInCart] = useState<boolean>()
//   const { addItemToCart, cart, hasInitializedCart, isProductInCart } = useCart()
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
//   const [quantity, setQuantity] = useState(1)

//   const handleAddToCart = () => {
//     console.log('handleAddToCart')
//     addItemToCart({
//       product,
//       quantity,
//       variant: selectedVariant ?? undefined,
//     })

//     router.push('/shop/cart-overlay')

//     // !isInCart
//     //   ? () => {

//     //     }
//     //   : undefined
//     // if (selectedVariant) {
//     //   console.log(
//     //     `Added to cart: ${product.title} - ${selectedVariant.title}, Quantity: ${quantity}`,
//     //   )
//     //   // Implement your add to cart logic here
//     // } else {
//     //   alert('Please select a size')
//     // }
//   }
//   useEffect(() => {
//     setIsInCart(isProductInCart(product))
//   }, [isProductInCart, product, cart])

//   return (
//     <Fragment>
//       <div className="mt-6">
//         <Select
//           onValueChange={(value) => {
//             // e.preventDefault()
//             console.log('onValueChange', value)
//             setSelectedVariant(product.variants?.find((v) => v.id === value) || null)
//           }}
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select size" />
//           </SelectTrigger>
//           <SelectContent>
//             {product.variants?.map((variant) => (
//               <SelectItem key={variant.id} value={variant.id ?? ''}>
//                 {variant.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="mt-4 flex items-center gap-4">
//         <Input
//           type="number"
//           min="1"
//           value={quantity}
//           onChange={(e) => setQuantity(parseInt(e.target.value))}
//           className="w-20"
//         />
//         <Button className="flex-grow" onClick={handleAddToCart}>
//           <ShoppingCartIcon className="mr-2 h-4 w-4" />
//           {isInCart ? '✓ View in cart' : 'Add to cart'}
//         </Button>
//       </div>
//     </Fragment>

//     // <Button
//     //   className={cn()}
//     //   onClick={
//     //     !isInCart
//     //       ? () => {
//     //           addItemToCart({
//     //             product,
//     //             quantity,
//     //           })

//     //           router.push('/store/cart-overlay')
//     //         }
//     //       : undefined
//     //   }
//     //   type={!isInCart ? 'button' : undefined}
//     // >
//     //
//     // </Button>
//   )
// }
