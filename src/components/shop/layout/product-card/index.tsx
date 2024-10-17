// 'use client'

// import React, { Fragment, useEffect, useState } from 'react'

// import Link from 'next/link'
// import { Product } from '@/payload-types'
// import { priceFromJSON } from '@lib/utils/priceFromJSON'
// import { Card, CardContent } from '@components/ui/card'
// import { Media } from '@/components/layout/media'
// import { Price } from '../price'

// export const ProductCard: React.FC<{
//   alignItems?: 'center'
//   className?: string
//   showCategories?: boolean
//   hideImagesOnMobile?: boolean
//   title?: string
//   relationTo?: 'products'
//   doc: Product
// }> = (props) => {
//   const {
//     showCategories,
//     title: titleFromProps,
//     doc,
//     doc: { slug, title, categories, priceJSON, meta } = {},
//     className,
//   } = props
//   const { description, image: metaImage } = meta || {}
//   const hasCategories = categories && Array.isArray(categories) && categories.length > 0
//   const titleToUse = titleFromProps || title
//   const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
//   const href = `/products/${slug}`

//   const [
//     price, // eslint-disable-line no-unused-vars
//     setPrice,
//   ] = useState(() => priceFromJSON(priceJSON || '', 1))

//   useEffect(() => {
//     setPrice(priceFromJSON(priceJSON || '', 1))
//   }, [priceJSON])

//   return (
//     <Card>
//       <Link href={href}>
//         {!metaImage && <div>No image</div>}
//         {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} fill />}
//       </Link>
//       <CardContent>
//         {showCategories && hasCategories && (
//           <div>
//             {showCategories && hasCategories && (
//               <div>
//                 {categories?.map((category, index) => {
//                   if (typeof category === 'object' && category !== null) {
//                     const { title: titleFromCategory } = category

//                     const categoryTitle = titleFromCategory || 'Untitled category'

//                     const isLast = index === categories.length - 1

//                     return (
//                       <Fragment key={index}>
//                         {categoryTitle}
//                         {!isLast && <Fragment>, &nbsp;</Fragment>}
//                       </Fragment>
//                     )
//                   }

//                   return null
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//         {titleToUse && (
//           <h4>
//             <Link href={href}>
//               {titleToUse}
//             </Link>
//           </h4>
//         )}
//         {description && (
//           <div>
//             {description && <p>{sanitizedDescription}</p>}
//           </div>
//         )}
//         {doc && <Price product={doc} />}
//       </CardContent>
//     </Card>
//   )
// }
