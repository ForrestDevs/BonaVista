// 'use client'

// import { cn } from '@lib/utils/cn'
// import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
// import type { Product } from '@/payload-types'
// import { Card } from '../Card'
// import { ArchiveBlockProps } from '@/blocks/ArchiveBlock/types'
// import qs from 'qs'
// import { PageRange } from '../PageRange'

// export type Props = {
//   categories?: ArchiveBlockProps['categories']
//   className?: string
//   limit?: number
//   onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
//   populateBy?: 'collection' | 'selection'
//   populatedDocs?: ArchiveBlockProps['populatedDocs']
//   populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
//   relationTo?: 'products'
//   selectedDocs?: ArchiveBlockProps['selectedDocs']
//   showPageRange?: boolean
//   sort?: string
// }

// type Result = {
//   docs: (Product | string)[]
//   hasNextPage: boolean
//   hasPrevPage: boolean
//   nextPage: number
//   page: number
//   prevPage: number
//   totalDocs: number
//   totalPages: number
// }

// export const ProductArchive: React.FC<Props> = (props) => {
//   const {
//     categories: catsFromProps,
//     className,
//     limit = 10,
//     onResultChange,
//     populateBy,
//     populatedDocs,
//     populatedDocsTotal,
//     relationTo,
//     selectedDocs,
//     showPageRange,
//     sort = '-createdAt',
//   } = props

//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | undefined>(undefined)
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const hasHydrated = useRef(false)
//   const isRequesting = useRef(false)
//   const [page, setPage] = useState(1)

//   const [results, setResults] = useState<Result>({
//     docs: (populateBy === 'collection'
//       ? populatedDocs
//       : populateBy === 'selection'
//         ? selectedDocs
//         : []
//     )?.map((doc: any) => doc.value),
//     hasNextPage: false,
//     hasPrevPage: false,
//     nextPage: 1,
//     page: 1,
//     prevPage: 1,
//     totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
//     totalPages: 1,
//   })

//   const categories = (catsFromProps || [])
//     .map((cat) => (typeof cat === 'object' ? cat?.id : cat))
//     .join(',')

//   const scrollToRef = useCallback(() => {
//     const { current } = scrollRef
//     if (current) {
//       current.scrollIntoView({
//         behavior: 'smooth',
//       })
//     }
//   }, [])

//   useEffect(() => {
//     if (!isLoading && typeof results.page !== 'undefined') {
//       scrollToRef()
//     }
//   }, [isLoading, scrollToRef, results])

//   useEffect(() => {
//     let timer: NodeJS.Timeout

//     if (populateBy === 'collection' && !isRequesting.current) {
//       isRequesting.current = true

//       // hydrate the block with fresh content after first render
//       // don't show loader unless the request takes longer than x ms
//       // and don't show it during initial hydration
//       timer = setTimeout(() => {
//         if (hasHydrated.current) {
//           setIsLoading(true)
//         }
//       }, 500)

//       const searchQuery = qs.stringify(
//         {
//           depth: 1,
//           limit,
//           page,
//           sort,
//           where: {
//             ...(categories
//               ? {
//                   categories: {
//                     in: categories,
//                   },
//                 }
//               : {}),
//           },
//         },
//         { encode: false },
//       )

//       const makeRequest = async () => {
//         try {
//           const req = await fetch(
//             `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}?${searchQuery}`,
//           )

//           const json = await req.json()
//           clearTimeout(timer)

//           const { docs } = json as { docs: Product[] }

//           if (docs && Array.isArray(docs)) {
//             setResults(json)
//             setIsLoading(false)
//             if (typeof onResultChange === 'function') {
//               onResultChange(json)
//             }
//           }
//         } catch (err) {
//           console.warn(err) // eslint-disable-line no-console
//           setIsLoading(false)
//           setError(`Unable to load "${relationTo} archive" data at this time.`)
//         }

//         isRequesting.current = false
//         hasHydrated.current = true
//       }

//       void makeRequest()
//     }

//     return () => {
//       if (timer) clearTimeout(timer)
//     }
//   }, [page, categories, relationTo, onResultChange, sort, limit, populateBy])

//   return (
//     <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
//       <div className="absoulte left-0 top-0" ref={scrollRef} />
//       {!isLoading && error && <Gutter>{error}</Gutter>}
//       <Fragment>
//         {showPageRange !== false && populateBy !== 'selection' && (
//           <Gutter>
//             <div className={classes.pageRange}>
//               <PageRange
//                 collection={relationTo}
//                 currentPage={results.page}
//                 limit={limit}
//                 totalDocs={results.totalDocs}
//               />
//             </div>
//           </Gutter>
//         )}
//         <Gutter>
//           <div className={classes.grid}>
//             {results.docs?.map((result, index) => {
//               if (typeof result === 'object' && result !== null) {
//                 return (
//                   <div className={classes.column} key={index}>
//                     <Card doc={result} relationTo={relationTo} showCategories />
//                   </div>
//                 )
//               }

//               return null
//             })}
//           </div>
//           {results.totalPages > 1 && populateBy !== 'selection' && (
//             <Pagination
//               className={classes.pagination}
//               onClick={setPage}
//               page={results.page}
//               totalPages={results.totalPages}
//             />
//           )}
//         </Gutter>
//       </Fragment>
//     </div>
//   )
// }
