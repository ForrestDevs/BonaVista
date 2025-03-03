'use client'

import { formatMoney } from '@/lib/utils/formatMoney'
import { motion } from 'motion/react'
import { CheckoutButton } from '../../checkout/checkout-button'
import { CheckoutLineItem } from '@/lib/types/checkout'
import { EnhancedProductVariant } from '@/lib/types/product'
import { useCart } from './cart-summary-context'
import { Cart } from '@payload-types'
import { CustomerDTO } from '@/lib/data/customer'

interface CartSummaryTotalsProps {
  cart: Cart
  customer: CustomerDTO | null
}

export function CartSummaryTotals({ cart, customer }: CartSummaryTotalsProps) {
  const { isUpdating } = useCart()
  const subtotal =
    cart.lineItems.reduce((acc, item) => acc + item.lineItem.price * item.lineItem.quantity, 0) ?? 0

  const lineItems: CheckoutLineItem[] = cart.lineItems.map((line) => {
    const price = line.lineItem.price
    const quantity = line.lineItem.quantity
    const productId =
      typeof line.lineItem.product === 'object' ? line.lineItem.product.id : line.lineItem.product
    const product = typeof line.lineItem.product === 'object' ? line.lineItem.product : null
    const productTitle = product?.title ?? 'N/A'
    const productDescription = product?.description ?? 'No description available'
    const isVariant = line.lineItem.isVariant
    const variantProduct = isVariant
      ? (product?.variants.variantProducts.find(
          (v) => v.sku === line.lineItem.sku,
        ) as EnhancedProductVariant)
      : null

    const variantOptions = variantProduct?.info.options.map((option) => ({
      key: option.key,
      value: {
        slug: option.slug,
        label: option.label,
      },
    }))
    const media = isVariant
      ? (variantProduct?.images[0]?.image ?? null)
      : (product?.baseProduct?.images[0]?.image ?? null)

    const thumbnail = typeof media === 'number' ? media : (media?.id ?? null)

    const newCheckoutLineItem: CheckoutLineItem = {
      productId: productId,
      sku: line.lineItem.sku,
      title: productTitle,
      description: productDescription,
      price: price, // price in floating point will convert to cents within server action when creating checkout session
      quantity: quantity,
      thumbnailMediaId: thumbnail,
      isVariant: isVariant,
      variantOptions: variantOptions,
      url: line.lineItem.url,
    }

    return newCheckoutLineItem
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg bg-neutral-50 px-6 py-6 border border-neutral-200"
    >
      <div className="flow-root">
        <div className="-my-4 divide-y divide-neutral-200 text-sm">
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Subtotal</div>
            <div className="font-medium text-neutral-900">
              {isUpdating ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
              ) : (
                formatMoney({ amount: subtotal, currency: 'CAD' })
              )}
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Shipping</div>
            <div className="font-medium text-neutral-900">Calculated at checkout</div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-neutral-600">Tax</div>
            <div className="font-medium text-neutral-900">Calculated at checkout</div>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="text-base font-medium text-neutral-900">Order total</div>
            <div className="text-base font-medium text-neutral-900">
              {isUpdating ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
              ) : (
                formatMoney({ amount: subtotal, currency: 'CAD' })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CheckoutButton
          amount={subtotal}
          currencyCode="CAD"
          description={`Order for ${cart.lineItems.length} items`}
          cartId={cart.id}
          lineItems={lineItems}
          stripeCustomerId={customer?.stripeCustomerId}
          customerEmail={customer?.email}
          customerId={customer?.id}
          redirectTo="/shop/checkout"
          disabled={isUpdating}
        />
      </div>
    </motion.div>
  )
}
