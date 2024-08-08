'use client'

import classes from './index.module.scss'

import Link from 'next/link'
import React, { Fragment } from 'react'
import type { Page, Settings } from '@/payload-types'
import { Button } from '@/components/payload/Button'
import { useAuth } from '@payloadcms/ui'
import { useCart } from '@/lib/providers/Cart'
import { HR } from '@/components/payload/HR'
import { LoadingShimmer } from '@/components/payload/LoadingShimmer'
// import { Media } from '../../../_components/Media'
import { Price } from '@/components/payload/Price'
import { RemoveFromCartButton } from '@/components/payload/RemoveFromCartButton'

export const CartPage: React.FC<{
  page: Page
  settings: Settings
}> = (props) => {
  const { settings } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()
  const { addItemToCart, cart, cartIsEmpty, cartTotal, hasInitializedCart } = useCart()

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href="/login?redirect=%2Fcart">Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.items}>
              <div className={classes.itemsTotal}>
                {`There ${cart?.items?.length === 1 ? 'is' : 'are'} ${cart?.items?.length} item${
                  cart?.items?.length === 1 ? '' : 's'
                } in your cart.`}
                {!user && (
                  <Fragment>
                    {' '}
                    <Link href="/login?redirect=%2Fcart">Log in</Link>
                    {` to save your progress.`}
                  </Fragment>
                )}
              </div>
              {cart?.items?.map((item, index) => {
                if (typeof item.product === 'object' && item.product !== null) {
                  const {
                    product,
                    product: { id, stripeProductID, title },
                    quantity,
                  } = item

                  const isLast = index === (cart?.items?.length || 0) - 1

                  //   const metaImage = meta?.image

                  return (
                    <Fragment key={index}>
                      <div className={classes.row}>
                        {/* <Link className={classes.mediaWrapper} href={`/products/${product.slug}`}>
                          {!metaImage && <span className={classes.placeholder}>No image</span>}
                          {metaImage && typeof metaImage !== 'string' && (
                            <Media
                              className={classes.media}
                              fill
                              imgClassName={classes.image}
                              resource={metaImage}
                            />
                          )}
                        </Link> */}
                        <div className={classes.rowContent}>
                          {!stripeProductID && (
                            <p className={classes.warning}>
                              {
                                'This product is not yet connected to Stripe. To link this product, '
                              }
                              <Link
                                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}
                              >
                                edit this product in the admin panel
                              </Link>
                              .
                            </p>
                          )}
                          <h5 className={classes.title}>
                            <Link className={classes.titleLink} href={`/products/${product?.slug}`}>
                              {title}
                            </Link>
                          </h5>
                          <div className={classes.actions}>
                            <label>
                              Quantity &nbsp;
                              <input
                                className={classes.quantity}
                                onChange={(e) => {
                                  addItemToCart({
                                    product,
                                    quantity: Number(e.target.value),
                                  })
                                }}
                                // fallback to empty string to avoid uncontrolled input error
                                type="number"
                                // this allows the user to user their backspace key to clear the input
                                value={typeof quantity === 'number' ? quantity : ''}
                              />
                            </label>
                            {/* <RemoveFromCartButton product={product && product} /> */}
                          </div>
                          {product != null ? ( // Check for null
                            <Price button={false} product={product} quantity={quantity ?? 0} />
                          ) : null}
                        </div>
                      </div>
                      {!isLast && <HR />}
                    </Fragment>
                  )
                }
                return null
              })}
              <HR />
              <h5 className={classes.cartTotal}>{`Total: ${cartTotal.formatted}`}</h5>
              <Button
                className={classes.checkoutButton}
                href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                label={user ? 'Checkout' : 'Login to checkout'}
                appearance="primary"
              />
              {/* <Link
                href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                className={classes.checkoutButton}
              >
                {user ? 'Checkout' : 'Login to checkout'}
              </Link> */}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
