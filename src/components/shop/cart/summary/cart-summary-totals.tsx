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
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0

  const lineItems: CheckoutLineItem[] = cart.items.map((line) => {
    const price = line.price
    const quantity = line.quantity
    const productId = typeof line.product === 'object' ? line.product.id : line.product
    const product = typeof line.product === 'object' ? line.product : null
    const productTitle = product?.title ?? 'N/A'
    const productDescription = product?.description ?? 'No description available'
    const isVariant = line.isVariant
    const variantProduct = isVariant
      ? (product?.variants.variantProducts.find(
          (v) => v.id === line.variant.id,
        ) as EnhancedProductVariant)
      : null

    const variantOptions = variantProduct?.info.options.map((option) => ({
      key: option.key,
      value: {
        slug: option.slug,
        label: option.label,
      },
    }))
    const sku = isVariant ? variantProduct?.sku : (product?.baseProduct?.sku ?? '')
    const media = isVariant
      ? (variantProduct?.images[0]?.image ?? null)
      : (product?.baseProduct?.images[0]?.image ?? null)

    const thumbnail = typeof media === 'string' ? media : media?.id

    const newCheckoutLineItem: CheckoutLineItem = {
      productId: productId,
      sku: sku,
      title: productTitle,
      description: productDescription,
      price: price * 100, // Stripe expects the price in cents
      quantity: quantity,
      thumbnailMediaId: thumbnail,
      isVariant: isVariant,
      variant: {
        id: line.variant?.id,
        variantOptions: variantOptions,
      },
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
          description={`Order for ${cart.items.length} items`}
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
