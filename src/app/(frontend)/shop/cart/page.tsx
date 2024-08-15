// import { type Metadata } from 'next/types'
// import { getTranslations } from 'next-intl/server'
// import { getCartFromCookiesAction } from '@/actions/cartActions'
// import { CheckoutCard } from '@/ui/checkout/CheckoutCard'

import { Button } from "@/components/ui/button";

// export const generateMetadata = async (): Promise<Metadata> => {
//   const t = await getTranslations('/cart.metadata')
//   return {
//     title: t('title'),
//   }
// }

export default async function CartPage() {
  return <div>Cart
    <Button variant="ghost">
      Buy Now
    </Button>
  </div>
  // const cart = await getCartFromCookiesAction()
  // if (!cart) {
  //   return null
  // }

  // return <CheckoutCard cart={cart.cart} />
}

// import type { Metadata } from 'next'
// import React, { Fragment } from 'react'
// import { notFound } from 'next/navigation'
// import type { Page, Settings } from '@/payload-types'
// import { Blocks } from '@/components/payload/Blocks'
// import { Hero } from '@/components/payload/Hero'
// import { generateMeta } from '@/lib/utils/generateMeta'
// import getPayload from '@/lib/utils/getPayload'
// import { COLLECTION_SLUG_PAGES } from '@/payload/collections/constants'
// import { Container } from '@/components/ui/craft'
// import MissingStripeKeyAlert from '@/components/errors/missing-stripe-key'
// import { CheckoutCard } from '@/components/store/checkout/CheckoutCard'

// // export const dynamic = 'force-dynamic'

// export default async function Cart() {
//   // const payload = await getPayload()

//   // let page: Page | null = null

//   // try {
//   //   const pages = await payload.find({
//   //     collection: COLLECTION_SLUG_PAGES,
//   //     where: {
//   //       slug: {
//   //         equals: 'cart',
//   //       },
//   //     },
//   //   })

//   //   page = pages.docs[0]
//   // } catch (error) {
//   //   // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
//   //   // so swallow the error here and simply render the page with fallback data where necessary
//   //   // in production you may want to redirect to a 404  page or at least log the error somewhere
//   //   // console.error(error)
//   // }

//   // if (!page) {
//   //   return notFound()
//   // }

//   // let settings: Settings | null = null

//   // try {
//   //   settings = await payload.findGlobal({
//   //     slug: 'settings',
//   //   })
//   // } catch (error) {
//   //   // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
//   //   // so swallow the error here and simply render the page with fallback data where necessary
//   //   // in production you may want to redirect to a 404  page or at least log the error somewhere
//   //   // console.error(error)
//   // }

//   return (
//     <Fragment>
//       <MissingStripeKeyAlert />
//       {/* <Hero {...page?.hero} /> */}
//       <Container>
//         <>Cart</>
//         {/* <CheckoutCard cart={cart.cart} /> */}
//       </Container>
//       {/* <Blocks blocks={page?.layout} /> */}
//     </Fragment>
//   )
// }

// // export async function generateMetadata(): Promise<Metadata> {
// //   let page: Page | null = null
// //   const payload = await getPayload()

// //   try {
// //     const pages = await payload.find({
// //       collection: COLLECTION_SLUG_PAGES,
// //       where: {
// //         slug: {
// //           equals: 'cart',
// //         },
// //       },
// //     })

// //     page = pages.docs[0]
// //   } catch (error) {
// //     // don't throw an error if the fetch fails
// //     // this is so that we can render a static cart page for the demo
// //     // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
// //     // in production you may want to redirect to a 404  page or at least log the error somewhere
// //   }

// //   return generateMeta({ doc: page, collectionSlug: COLLECTION_SLUG_PAGES })
// // }
