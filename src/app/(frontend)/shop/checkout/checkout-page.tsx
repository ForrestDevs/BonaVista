'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect } from 'react'
import { User, type Settings } from '@payload-types'
import { useAuth, useTheme } from '@payloadcms/ui'
import { useCart } from '@/lib/providers/Cart'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import Spinner from '@/components/ui/spinner'
import CheckoutForm from './checkout-form'
import { Media } from '@/components/layout/media'
import { Price } from '@/components/shop/layout/price'

const apiKey = `${process.env.STRIPE_PUBLISHABLE_KEY}`


export const CheckoutPage: React.FC<{
  settings: Settings
  user: User
}> = (props) => {
  const {
    settings: { productsPage },
  } = props
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)
  const [clientSecret, setClientSecret] = React.useState()
  const hasMadePaymentIntent = React.useRef(false)

  const { cart, cartIsEmpty, cartTotal } = useCart()

  const stripe = loadStripe(apiKey)
  useEffect(() => {
    if (props.user !== null && cartIsEmpty) {
      router.push('/shop/cart')
    }
  }, [router, props.user, cartIsEmpty])

  useEffect(() => {
    if (props.user && cart && hasMadePaymentIntent.current === false) {
      hasMadePaymentIntent.current = true

      const makeIntent = async () => {
        try {
          const paymentReq = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
            {
              credentials: 'include',
              method: 'POST',
            },
          )

          const res = await paymentReq.json()

          if (res.error) {
            setError(res.error)
          } else if (res.client_secret) {
            setError(null)
            setClientSecret(res.client_secret)
          }
        } catch (e) {
          setError('Something went wrong.')
        }
      }

      makeIntent()
    }
  }, [cart, props.user])

  // useEffect(() => {
  //   const initializeStripe = async () => {
  //     const stripeInstance = await stripe // Await the promise
  //     if (stripeInstance && clientSecret) {
  //       const elements = stripeInstance.elements({ clientSecret, appearance: { theme: 'flat' } })
  //       const paymentElement = elements.create('payment')
  //       paymentElement.mount('#payment-element')
  //     }
  //   }
  //   initializeStripe()
  // }, [clientSecret, stripe])

  if (!stripe) return <Spinner color="red" />

  if (!props.user) return <div>{props.user}</div>

  return (
    <Fragment>
      {cartIsEmpty && (
        <div>
          {'Your '}
          <Link href="/shop/cart">cart</Link>
          {' is empty.'}
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      )}
      {!cartIsEmpty && (
        <div>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object') {
              const { product, quantity } = item

              if (!quantity) return null

              const isLast = index === (cart?.items?.length || 0) - 1

              const metaImage = product?.images?.[0]

              return (
                <Fragment key={index}>
                  <div>
                    <div>
                      {!metaImage && <span>No image</span>}
                      {metaImage && typeof metaImage !== 'string' && (
                        <Media fill resource={metaImage.image?.toString() || ''} />
                      )}
                    </div>
                    <div>
                      {!product?.stripeProductID && (
                        <p>
                          {'This product is not yet connected to Stripe. To link this product, '}
                          <Link
                            href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${product?.id}`}
                          >
                            edit this product in the admin panel
                          </Link>
                          .
                        </p>
                      )}
                      <h6>{product?.title}</h6>
                      <Price button={false} product={product!} quantity={quantity} />
                    </div>
                  </div>
                  {/* {!isLast && <HR />} */}
                </Fragment>
              )
            }
            return null
          })}
          <div>{`Order total: ${cartTotal.formatted}`}</div>
        </div>
      )}
      {!clientSecret && !error && <Spinner />}
      {!clientSecret && error && (
        <div>
          <p>{`Error: ${error}`}</p>
          <p>UHOH</p>
          <YnsLink href="/shop/cart">
            <Button variant={'secondary'}>Back to cart</Button>
          </YnsLink>
        </div>
      )}
      {clientSecret && (
        <Fragment>
          {error && <p>{`Error: ${error}`}</p>}
          {/* <div id="payment-element"></div> */}
          <Elements
            options={{
              appearance: {
                theme: 'flat',
                // variables: {
                //   borderRadius: '0px',
                //   fontFamily: 'Inter, sans-serif',
                //   fontSizeBase: '16px',
                //   fontWeightBold: '600',
                //   fontWeightNormal: '500',
                // },
              },
              clientSecret,
            }}
            stripe={stripe}
          >
            <CheckoutForm />
          </Elements>
        </Fragment>
      )}
    </Fragment>
  )
}
