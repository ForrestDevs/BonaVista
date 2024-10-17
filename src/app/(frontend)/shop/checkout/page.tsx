import React from 'react'
import type { Metadata } from 'next'
import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
import Wrapper from '@components/shop/checkout/payment-wrapper'
import { CheckoutForm } from '@components/shop/checkout/checkout-form'
import { CheckoutSummary } from '@components/shop/checkout/checkout-summary'
import { getCart } from '@lib/data/cart'

export const metadata: Metadata = {
  description: 'Checkout',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}

export default async function Checkout() {
  const cart = await getCart()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_416px] container gap-x-40 py-12">
      <Wrapper cart={cart}>
        <CheckoutForm />
      </Wrapper>
      <CheckoutSummary />
    </div>
  )
}

// const headers = getHeaders()

//   const { user } = await getMeUser({
//     nullUserRedirect: `/login?error=${encodeURIComponent(
//       'You must be logged in to checkout.',
//     )}&redirect=${encodeURIComponent('/checkout')}`,
//   })

// try {
//   const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//   const data = await req.json()
//   console.log(JSON.stringify(data, null, 2))
// } catch (err) {
//   console.log(err)
// }
// const payload = await getPayload()

// const { user } = await payload.auth({
//   headers,
// })

// console.log(user)

// let settings: Settings | null = null

// try {
//   settings = await getCachedGlobal<'settings'>('settings')
// } catch (error) {
//   // no need to redirect to 404 here, just simply render the page with fallback data where necessary
//   console.error(error) // eslint-disable-line no-console
// }

{
  /* <LowImpactHero
        media={null}
        richText={{
          root: {
            type: 'root',
            children: [
              {
                type: 'h1',
                version: 1,
                children: [
                  {
                    text: 'Checkout',
                  },
                ],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    text: `This is a self-hosted, secure checkout using Stripe's Payment Element component. To create a mock purchase, use a `,
                  },
                  {
                    type: 'link',
                    children: [
                      {
                        text: 'test credit card',
                      },
                    ],
                    url: 'https://stripe.com/docs/testing#cards',
                  },
                  {
                    text: ' like ',
                  },
                  {
                    bold: true,
                    text: '4242 4242 4242 4242',
                  },
                  {
                    text: ' with any future date and CVC. An order will be generated in Stripe and will appear in your account. In production, this checkout form will require a real card with sufficient funds.',
                  },
                ],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        }}
        type="lowImpact"
      /> */
}

// 'use client'

// import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
// import { useRouter } from 'next/navigation'
// import React, { useCallback } from 'react'

// import type { Order } from '@payload-types'
// import { useCart } from '@lib/providers/Cart'
// import { priceFromJSON } from '@lib/utils/priceFromJSON'
// import { Button } from '@components/ui/button'
// import { YnsLink } from '@components/ui/link'

// export const CheckoutForm: React.FC<{}> = () => {
//   const stripe = useStripe()
//   const elements = useElements()
//   const [error, setError] = React.useState<null | string>(null)
//   const [isLoading, setIsLoading] = React.useState(false)
//   const router = useRouter()
//   const { cart, cartTotal } = useCart()

//   const handleSubmit = useCallback(
//     async (e: any) => {
//       e.preventDefault()
//       setIsLoading(true)

//       if (!stripe || !elements) {
//         // Stripe.js hasn't yet loaded.
//         // Make sure to disable form submission until Stripe.js has loaded.
//         return
//       }

//       try {
//         const res = await stripe.confirmPayment({
//           elements,
//           confirmParams: {
//             return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order-confirmation`,
//           },
//           redirect: 'if_required',
//         })

//         if (res?.error) {
//           setError(res.error.message || 'Something went wrong.')
//           setIsLoading(false)
//         }

//         if (res?.paymentIntent) {
//           // Before redirecting to the order confirmation page, we need to create the order in Payload
//           // Cannot clear the cart yet because if you clear the cart while in the checkout
//           // you will be redirected to the `/cart` page before this redirect happens
//           // Instead, we clear the cart in an `afterChange` hook on the `orders` collection in Payload
//           try {
//             const orderReq = await fetch('http://localhost:3000/api/orders', {
//               method: 'POST',
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({

//                 // items: (cart?.items || [])?.map(({ product, quantity }) => ({
//                 //   price:
//                 //     typeof product === 'object'
//                 //       ? product.enableVariants
//                 //         ? product.variants.variantProducts[0].price
//                 //         : product.baseProduct?.price
//                 //       : undefined,
//                 //   product: typeof product === 'string' ? product : product?.id,
//                 //   quantity,
//                 // })),
//                 stripePaymentIntentID: res.paymentIntent.id,
//                 total: cartTotal.amount,
//               }),
//             })

//             if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.')

//             const {
//               doc,
//               error: errorFromRes,
//             }: {
//               doc: Order
//               error?: string
//               message?: string
//             } = await orderReq.json()

//             if (errorFromRes) throw new Error(errorFromRes)

//             router.push(`/shop/order-confirmation?order_id=${doc.id}`)
//           } catch (err) {
//             // don't throw an error if the order was not created successfully
//             // this is because payment _did_ in fact go through, and we don't want the user to pay twice
//             console.error(err) // eslint-disable-line no-console
//             router.push(`/shop/order-confirmation?error=${encodeURIComponent(err as string)}`)
//           }
//         }
//       } catch (err) {
//         const msg = err instanceof Error ? err.message : 'Something went wrong.'
//         setError(`Error while submitting payment: ${msg}`)
//         setIsLoading(false)
//       }
//     },
//     [stripe, elements, router, cart, cartTotal],
//   )

//   return (
//     // <form id="payment-form" onSubmit={handleSubmit}>
//     //   <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
//     //   <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmit}>
//     //     <span id="button-text">
//     //       {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
//     //     </span>
//     //   </button>
//     //   {/* Show any error or success messages */}
//     //   {error && <div id="payment-message">{error}</div>}
//     // </form>
//     <form onSubmit={handleSubmit} className="flex flex-col">
//       {error && <p>{error}</p>}
//       <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

//       <div className="flex justify-between z-10 mt-10">
//         <YnsLink href="/shop/cart">
//           <Button variant="secondary">Back to cart</Button>
//         </YnsLink>

//         <Button disabled={!stripe || isLoading} type="submit">
//           {isLoading ? 'Loading...' : 'Checkout'}
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default CheckoutForm

// 'use client'

// import { LoadingShimmer } from '@components/payload/LoadingShimmer'
// import { Media } from '@components/payload/Media'
// import { Message } from '@components/payload/Message'
// import Price from '@components/shop/price'
// import { Button } from '@components/ui/button'
// import { Input } from '@components/ui/input'
// import { Label } from '@components/ui/label'
// import { useAuth } from '@lib/providers/Auth'
// import { useCart } from '@lib/providers/Cart'
// // import { useTheme } from '@lib/providers/Theme'
// import { Elements } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react'
// // import { stripe } from '@payload/stripe'
// import { CSSGLOBALS } from '@lib/utils/cssVariables'
// // import { CheckoutForm } from '../CheckoutForm'
// // import { CheckoutForm } from '../CheckoutForm'
// import { useTheme } from 'next-themes'
// import CheckoutForm from './checkout-form'

// const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
// const stripe = loadStripe(apiKey)

// export const CheckoutPage: React.FC = () => {
//   const { user } = useAuth()
//   const router = useRouter()
//   const [error, setError] = useState<null | string>(null)
//   const [clientSecret, setClientSecret] = useState()
//   const hasMadePaymentIntent = useRef(false)
//   const { theme } = useTheme()
//   const [email, setEmail] = useState('')
//   const [emailEditable, setEmailEditable] = useState(true)
// const { cart, cartIsEmpty, cartTotal } = useCart()

// useEffect(() => {
//   if (
//     cart &&
//     (user || (Boolean(email) && !emailEditable)) &&
//     hasMadePaymentIntent.current === false
//   ) {
//     hasMadePaymentIntent.current = true

//     const makeIntent = async () => {
//       try {
//         const body = !user
//           ? {
//               cart,
//               email,
//             }
//           : undefined

//         const paymentReq = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
//           {
//             ...(body
//               ? {
//                   body: JSON.stringify(body),
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                 }
//               : {}),
//             credentials: 'include',
//             method: 'POST',
//           },
//         )

//         const res = await paymentReq.json()

//         if (res.error) {
//           setError(res.error)
//         } else if (res.client_secret) {
//           setError(null)

//           setClientSecret(res.client_secret)
//         }
//       } catch (e) {
//         setError('Something went wrong.')
//       }
//     }

//     void makeIntent()
//   }
// }, [user, emailEditable, email])

//   if (!stripe) return null

//   return (
//     <div className="flex flex-col items-stretch justify-stretch md:flex-row gap-6 md:gap-12">
//       <div className="w-full flex-grow flex flex-col gap-8">
//         {/* <div className="prose dark:prose-invert bg-black rounded-sm p-4 flex-grow w-full flex items-center">
//           <Button asChild className="no-underline text-inherit" variant="outline">
//             <Link href="/login">Log in</Link>
//           </Button>
//           <p className="mt-0">
//             <span className="mx-2">or</span>
//             <Link href="/create-account">create an account</Link>
//           </p>
//         </div> */}
//         {user ? (
//           <div className="bg-black rounded-sm p-4 w-full">
//             <div>
//               <p>{user.email}</p>{' '}
//               <p>
//                 Not you? <Link href="/logout">Log out</Link>
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-black rounded-sm p-4 w-full">
//             <div>
//               <p className="mb-4">Enter your email to checkout as a guest.</p>
//               <div className="max-w-sm mb-4">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   disabled={!emailEditable}
//                   id="email"
//                   name="email"
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   type="email"
//                 />
//               </div>
//               <Button
//                 disabled={!email}
//                 onClick={() => {
//                   setEmailEditable(false)
//                 }}
//                 variant="default"
//               >
//                 Continue as guest
//               </Button>
//             </div>
//           </div>
//         )}

//         {cartIsEmpty && (
//           <div className="prose dark:prose-invert">
//             <p>
//               Your cart is empty.
//               <Link href="/search">Continue shopping?</Link>
//             </p>
//           </div>
//         )}
//         {!clientSecret && !error && (
//           <div className="my-8">
//             <LoadingShimmer number={2} />
//           </div>
//         )}
//         {!clientSecret && error && (
//           <div className="my-8">
//             <Message error={error} />

//             <Button onClick={() => router.refresh()} variant="default">
//               Try again
//             </Button>
//           </div>
//         )}
//         <Suspense fallback={<React.Fragment />}>
//           {clientSecret && (
//             <Fragment>
//               {error && <p>{`Error: ${error}`}</p>}
//               <Elements
//                 options={{
//                   appearance: {
//                     theme: 'stripe',
//                     variables: {
//                       borderRadius: '0px',
//                       colorBackground:
//                         theme === 'dark' ? CSSGLOBALS.colors.base850 : CSSGLOBALS.colors.base0,
//                       colorDanger: CSSGLOBALS.colors.error500,
//                       colorDangerText: CSSGLOBALS.colors.error500,
//                       colorIcon:
//                         theme === 'dark' ? CSSGLOBALS.colors.base0 : CSSGLOBALS.colors.base1000,
//                       colorText:
//                         theme === 'dark' ? CSSGLOBALS.colors.base0 : CSSGLOBALS.colors.base1000,
//                       colorTextPlaceholder: CSSGLOBALS.colors.base500,
//                       fontFamily: 'Inter, sans-serif',
//                       fontSizeBase: '16px',
//                       fontWeightBold: '600',
//                       fontWeightNormal: '500',
//                     },
//                   },
//                   clientSecret,
//                 }}
//                 stripe={stripe}
//               >
//                 <CheckoutForm />
//               </Elements>
//             </Fragment>
//           )}
//         </Suspense>
//       </div>
//       {!cartIsEmpty && (
//         <div className="max-w-md w-full">
//           {cart?.items?.map((item, index) => {
//             if (typeof item.product === 'object') {
//               const {
//                 product,
//                 product: { id, title, gallery },
//                 quantity,
//                 variant: variantId,
//               } = item

//               let stripeProductID

//               if (variantId) {
//                 const variant = product.variants.variantProducts.find((v) => v.id === variantId)
//                 // stripeProductID = variant.stripeProductID
//               } else {
//                 // stripeProductID = product.stripeProductID
//               }

//               if (!quantity) return null

//               const isLast = index === (cart?.items?.length || 0) - 1

//               const metaImage = gallery[0]?.image

//               const hasVariants =
//                 product.enableVariants && product.variants?.variantProducts?.length
//               const price = hasVariants
//                 ? product.variants.variantProducts[0].price
//                 : product.baseProduct?.price

//               return (
//                 <Fragment key={index}>
//                   <div className="">
//                     <div className="relative">
//                       {!metaImage && <span className="classes.placeholder">No image</span>}
//                       {metaImage && typeof metaImage !== 'string' && (
//                         <Media className="" fill imgClassName="" resource={metaImage} />
//                       )}
//                     </div>
//                     <div className="">
//                       {!stripeProductID && (
//                         <p className="classes.warning">
//                           {'This product is not yet connected to Stripe. To link this product, '}
//                           <Link
//                             href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
//                           >
//                             edit this product in the admin panel
//                           </Link>
//                           .
//                         </p>
//                       )}
//                       <h6 className="">{title}</h6>

//                       <Price amount={price} currencyCode="usd" />
//                     </div>
//                   </div>
//                   {!isLast && <hr />}
//                 </Fragment>
//               )
//             }
//             return null
//           })}
//           <div className="flex gap-2">
//             <span>Order total:</span> <Price amount={cartTotal.amount} currencyCode="usd" />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
