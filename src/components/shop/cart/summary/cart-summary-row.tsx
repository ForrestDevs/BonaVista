'use client'

import { Media } from '@/components/payload/Media'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/lib/types/cart'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { updateCartItemQuantityAction } from '@/lib/actions/cart'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { HTMLMotionProps, motion } from 'motion/react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/formatMoney'
import { debounce } from 'lodash'
import { useCart } from './cart-summary-context'
import { useRouter } from 'next/navigation'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'

type CartSummaryRowProps = {
  line: CartItem
  deleteCartItemCallback: (input: { cartItemId: string }) => void
  index: number
  length: number
} & HTMLMotionProps<'li'>

export const CartSummaryRow = forwardRef<HTMLLIElement, CartSummaryRowProps>(
  (
    { line, deleteCartItemCallback, className, index, length, ...rest }: CartSummaryRowProps,
    ref,
  ) => {
    const router = useRouter()
    const { setIsUpdating } = useCart()
    const [optimisticQuantity, setOptimisticQuantity] = useState(line.lineItem.quantity)
    const { execute, hasErrored } = useAction(updateCartItemQuantityAction, {
      onSuccess: () => {
        setTimeout(() => {
          setIsUpdating(false)
          router.refresh()
        }, 1000)
      },
    })

    const product = typeof line.lineItem.product === 'object' ? line.lineItem.product : null
    const slug = product?.slug
    const productTitle =
      typeof line.lineItem.product === 'object'
        ? line.lineItem.product.title
        : line.lineItem.product
    const isVariant = line.lineItem.isVariant
    const variantOptions = isVariant
      ? line.lineItem.variantOptions.map((v) => v.value.label).join(', ')
      : null
    const thumbnail = isVariant
      ? product?.variants.variantProducts.find((v) => v.sku === line.lineItem.sku)?.images[0]?.image
      : product?.baseProduct?.images[0]?.image

    const debouncedExecute = useMemo(
      () =>
        debounce(async (quantity: number) => {
          execute({ quantity, cartItemId: line.id })
        }, 1000),
      [execute, line.id],
    )

    useEffect(() => {
      if (hasErrored) {
        setOptimisticQuantity(line.lineItem.quantity)
      }
    }, [hasErrored, line.lineItem.quantity])

    const handleUpdateQuantity = (quantity: number) => {
      setIsUpdating(true)
      setOptimisticQuantity(quantity)
      debouncedExecute(quantity)
    }

    return (
      <motion.li
        key={line.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        ref={ref}
        className={cn('py-6', className)}
        {...rest}
      >
        <div className="flex items-center gap-6">
          {thumbnail ? (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <Media
                resource={thumbnail}
                imgClassName="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="h-24 w-24 flex-shrink-0 rounded-md bg-neutral-100" />
          )}

          <div className="flex flex-1 flex-col">
            <div className="flex justify-between">
              <div>
                <OptimizedLink href={`/shop/product/${slug}`}>
                  <h3 className="font-medium text-neutral-900 hover:underline hover:text-blue-500 transition-colors duration-200">
                    {productTitle}
                  </h3>
                </OptimizedLink>
                {isVariant && <p className="mt-1 text-sm text-neutral-500">{variantOptions}</p>}
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {formatCurrency({
                  amount: line.lineItem.price * optimisticQuantity,
                  currency: 'CAD',
                })}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-neutral-300 divide-x divide-neutral-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-neutral-100 rounded-none rounded-l-md"
                    onClick={() => handleUpdateQuantity(optimisticQuantity - 1)}
                    disabled={optimisticQuantity <= 1}
                  >
                    <MinusIcon className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[2.5rem] text-center">{optimisticQuantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-neutral-100 rounded-none rounded-r-md"
                    onClick={() => handleUpdateQuantity(optimisticQuantity + 1)}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                </div>
                {optimisticQuantity > 1 && (
                  <p className="text-sm text-neutral-500">
                    (${line.lineItem.price.toFixed(2)} each)
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-red-600"
                onClick={() => deleteCartItemCallback({ cartItemId: line.id })}
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </motion.li>
    )
  },
)

CartSummaryRow.displayName = 'CartSummaryRow'
