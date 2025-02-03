import { Badge } from '@/components/ui/badge'
import type { PaymentIntent } from '@stripe/stripe-js'
import { type ComponentProps, Fragment } from 'react'
import { getCart } from '@/lib/data/cart'
import getPayload from '@/lib/utils/getPayload'
import { ClearCookieClientComponent } from '@/components/shop/clear-cookie.client'
import CartItemDetails, { CartItemThumbnail } from '@/components/shop/cart/cart-item-details'
import type { Metadata } from 'next'
import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Order Confirmation | BonaVista LeisureScapes',
    description: 'Your order has been confirmed.',
    openGraph: mergeOpenGraph({
      title: 'Order Confirmation',
      url: '/shop/order/success',
    }),
  }
}

export default async function OrderDetailsPage(props: {
  searchParams: Promise<{
    payment_intent?: string | string[] | undefined | null
    payment_intent_client_secret?: string | string[] | undefined | null
    order_id?: string | string[] | undefined | null
  }>
}) {
  const searchParams = await props.searchParams
  if (
    typeof searchParams.payment_intent !== 'string' ||
    typeof searchParams.payment_intent_client_secret !== 'string' ||
    typeof searchParams.order_id !== 'string'
  ) {
    return <div>Invalid order details</div>
  }

  const payload = await getPayload()

  const order = await payload.findByID({
    collection: 'orders',
    id: searchParams.order_id,
  })

  if (!order) {
    return <div>Order not found</div>
  }
  const cookie = await getCart()
  //   const t = await getTranslations('/order.page')
  //   const locale = await getLocale()

  //   const isDigital = (lines: Commerce.Order['lines']) => {
  //     return lines.some(({ product }) => Boolean(product.metadata.digitalAsset))
  //   }

  return (
    <article className="max-w-3xl pb-32">
      {/* <ClearCookieClientComponent cartId={order.order.id} cookieId={cookie?.id} /> */}
      <h1 className="mt-4 inline-flex items-center text-3xl font-bold leading-none tracking-tight">
        Order Confirmation
        <PaymentStatus status={order.status} />
      </h1>
      <p className="mt-2">Thank you for your order!</p>
      <dl className="mt-12 space-y-2 text-sm">
        <dt className="font-semibold text-foreground">Order Number</dt>
        <dd className="text-accent-foreground">{order.id.slice(3)}</dd>
      </dl>

      <h2 className="sr-only">Products</h2>
      <ul role="list" className="my-8 divide-y border-y">
        {order.items.map((item) => (
          <li key={item.id} className="py-8">
            <article className="grid grid-cols-[auto,1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 font-semibold leading-none text-neutral-700">
                <CartItemDetails item={item} />
                {/* {item.product.title} - {item.variant.map((v) => v.option).join(', ')} */}
              </h3>
              <CartItemThumbnail item={item} />
              <div className="prose row-start-2 text-secondary-foreground">
                {/* <Markdown source={line.product.description || ''} /> */}
              </div>
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">Price</dt>
                    <dd className="text-sm text-accent-foreground">
                      {item.price.toFixed(2)}
                      {/* {formatMoney({
                        amount: line.product.default_price.unit_amount ?? 0,
                        currency: line.product.default_price.currency,
                        locale,
                      })} */}
                    </dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">Quantity</dt>
                    <dd className="text-sm text-accent-foreground">{item.quantity}</dd>
                  </div>

                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">Total</dt>
                    <dd className="text-sm text-accent-foreground">
                      {(item.price * item.quantity).toFixed(2)}
                      {/* {formatMoney({
                        amount: (line.product.default_price.unit_amount ?? 0) * line.quantity,
                        currency: line.product.default_price.currency,
                        locale,
                      })} */}
                    </dd>
                  </div>
                </dl>
              </footer>
            </article>
          </li>
        ))}
        {order.shippingRate && (
          <li className="py-8">
            <article className="grid grid-cols-[auto,1fr] grid-rows-[repeat(auto,3)] justify-start gap-x-4 sm:gap-x-8">
              <h3 className="row-start-1 font-semibold leading-none text-neutral-700">
                {order.shippingRate.displayName}
              </h3>
              <div className="col-start-1 row-span-3 row-start-1 mt-0.5 w-16 sm:mt-0 sm:w-32" />
              <footer className="row-start-3 mt-2 self-end">
                <dl className="grid grid-cols-[max-content,auto] gap-2 sm:grid-cols-3">
                  <div className="max-sm:col-span-2 max-sm:grid max-sm:grid-cols-subgrid">
                    <dt className="text-sm font-semibold text-foreground">Price</dt>
                    <dd className="text-sm text-accent-foreground">
                      {order.shippingRate.rate.toFixed(2)}
                      {/* {formatMoney({
                        amount: order.shippingRate.fixed_amount.amount ?? 0,
                        currency: order.shippingRate.fixed_amount.currency,
                        locale,
                      })} */}
                    </dd>
                  </div>
                </dl>
              </footer>
            </article>
          </li>
        )}
      </ul>

      <div className="pl-20 sm:pl-40">
        <h2 className="sr-only">Details</h2>
        {/* {isDigital(order.lines) && (
          <div className="mb-8">
            <h3 className="font-semibold leading-none text-neutral-700">Digital Asset</h3>
            <ul className="mt-3">
              {order.lines
                .filter((line) => line.product.metadata.digitalAsset)
                .map((line) => {
                  return (
                    <li key={line.product.id} className="text-sm">
                      <a
                        href={line.product.metadata.digitalAsset}
                        target="_blank"
                        download={true}
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {line.product.name}
                      </a>
                    </li>
                  )
                })}
            </ul>
          </div>
        )} */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* {order.shipping?.address && (
            <div>
              <h3 className="font-semibold leading-none text-neutral-700">
                Shipping Address
              </h3>
              <p className="mt-3 text-sm">
                {[
                  order.order.shipping.name,
                  order.order.shipping.address.line1,
                  order.order.shipping.address.line2,
                  order.order.shipping.address.postal_code,
                  order.order.shipping.address.city,
                  order.order.shipping.address.state,
                  findMatchingCountry(order.order.shipping.address?.country)?.label,
                  '\n',
                  order.order.shipping.phone,
                  order.order.receipt_email,
                ]
                  .filter(Boolean)
                  .map((line, idx) => (
                    <Fragment key={idx}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
              </p>
            </div>
          )} */}

          {/* {order.order.payment_method?.billing_details.address && (
            <div>
              <h3 className="font-semibold leading-none text-neutral-700">{t('billingAddress')}</h3>
              <p className="mt-3 text-sm">
                {[
                  order.order.payment_method.billing_details.name,
                  order.order.payment_method.billing_details.address.line1,
                  order.order.payment_method.billing_details.address.line2,
                  order.order.payment_method.billing_details.address.postal_code,
                  order.order.payment_method.billing_details.address.city,
                  order.order.payment_method.billing_details.address.state,
                  findMatchingCountry(order.order.payment_method?.billing_details?.address?.country)
                    ?.label,
                  '\n',
                  order.order.payment_method.billing_details.phone,
                  order.order.receipt_email,
                ]
                  .filter(Boolean)
                  .map((line, idx) => (
                    <Fragment key={idx}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                {order.order.metadata.taxId && `${t('taxId')}: ${order.order.metadata.taxId}`}
              </p>
            </div>
          )}

          {order.order.payment_method?.type === 'card' && order.order.payment_method.card && (
            <div className="border-t pt-8 sm:col-span-2">
              <h3 className="font-semibold leading-none text-neutral-700">{t('paymentMethod')}</h3>
              <p className="mt-3 text-sm">
                {order.order.payment_method.card.brand &&
                  order.order.payment_method.card.brand in paymentMethods && (
                    <Image
                      src={
                        paymentMethods[
                          order.order.payment_method.card.brand as keyof typeof paymentMethods
                        ]
                      }
                      className="mr-1 inline-block w-6 align-text-bottom"
                      alt=""
                    />
                  )}
                <span className="sr-only">{t('cardBrand')} </span>
                <span className="capitalize">{order.order.payment_method.card.display_brand}</span>
              </p>
              <p className="mt-1.5 text-sm tabular-nums">
                <span className="sr-only">{t('last4CardDigitsLabel')} </span>
                <span aria-hidden>••••</span>
                {order.order.payment_method.card.last4}
              </p>
            </div>
          )} */}

          <div className="col-span-2 grid grid-cols-2 gap-8 border-t pt-8">
            <h3 className="font-semibold leading-none text-neutral-700">Total</h3>
            <p>{order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

const PaymentStatus = async ({ status }: { status: PaymentIntent.Status }) => {
  //   const t = await getTranslations('/order.paymentStatus')
  const statusToVariant = {
    canceled: 'destructive',
    processing: 'secondary',
    requires_action: 'destructive',
    requires_capture: 'destructive',
    requires_confirmation: 'destructive',
    requires_payment_method: 'destructive',
    succeeded: 'default',
  } satisfies Record<PaymentIntent.Status, ComponentProps<typeof Badge>['variant']>

  return (
    <Badge className="ml-2 capitalize" variant={statusToVariant[status]}>
      {status}
      {/* {t(status)} */}
    </Badge>
  )
}


// import React from 'react'
// import { Metadata } from 'next'
// import { mergeOpenGraph } from '@lib/utils/mergeOpenGraph'
// import { notFound } from 'next/navigation'
// import getPayload from '@lib/utils/getPayload'
// // import { serverClient } from '@lib/trpc/serverClient'
// // import OrderCompletedTemplate from '@/components/shop/order/templates/order-completed-template'

// type Props = {
//   params: { id: string }
// }

// export const metadata: Metadata = {
//   title: 'Order Confirmation',
//   description: 'Your order has been confirmed.',
//   openGraph: mergeOpenGraph({
//     title: 'Order Confirmation',
//     url: '/order-confirmation',
//   }),
// }


// export default async function OrderConfirmedPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ slug: string }>
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
// }) {
//   const { slug } = await params
//   const { order_id } = await searchParams
//   const orderId = Array.isArray(order_id)
//     ? order_id[0]
//     : order_id
//   if (!orderId) {
//     return notFound() // Handle case where orderId is undefined
//   }
  
//   const payload = await getPayload()

//   const order = await payload.findByID({
//     collection: 'orders',
//     id: orderId,
//   })

//   return (
//     <div className="p-4 m-6 flex-1">
//       <h1 className="text-2xl">Thank You for your purchase!</h1>
//       <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md overflow-x-auto mt-4">
//         {JSON.stringify(order, null, 2)}
//       </pre>
//     </div>
//   )
// }

// 'use client'

// import React, { Fragment, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { useCart } from '@lib/providers/Cart'
// import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
// import { AlertCircle } from 'lucide-react'
// import Link from 'next/link'

// export const OrderConfirmation: React.FC<{}> = () => {
//   const searchParams = useSearchParams()
//   const orderID = searchParams.get('order_id')
//   const error = searchParams.get('error')

//   const { clearCart } = useCart()

//   useEffect(() => {
//     clearCart()
//   }, [clearCart])

//   return (
//     <div>
//       {error ? (
//         <Fragment>
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <p>
//             {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
//           </p>
//           <div className="flex wrap g-4">
//             <Link href={'/account'}>View account</Link>
//             <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}>View all orders</Link>
//           </div>
//         </Fragment>
//       ) : (
//         <Fragment>
//           <h1>Thank you for your order!</h1>
//           <p>
//             {`Your order has been confirmed. You will receive an email confirmation shortly. Your order ID is ${orderID}.`}
//           </p>
//           <div className="flex wrap g-4">
//             <Link href={`/orders/${orderID}`}>View order</Link>
//             <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}>View all orders</Link>
//           </div>
//         </Fragment>
//       )}
//     </div>
//   )
// }

