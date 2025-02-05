'use client'

import { Media } from '@/components/payload/Media'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/lib/types/cart'
import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { updateCartItemQuantityAction } from '@/lib/actions/cart'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/formatMoney'
import { debounce } from 'lodash'

type CartSummaryRowProps = {
  line: CartItem
  deleteCartItemCallback: (input: { cartItemId: string }) => void
  index: number
  length: number
} & HTMLMotionProps<'li'>

export const CartSummaryRow = forwardRef<HTMLLIElement, CartSummaryRowProps>(
  ({ line, deleteCartItemCallback, className, index, length, ...rest }: CartSummaryRowProps, ref) => {
    const [optimisticQuantity, setOptimisticQuantity] = useState(line.quantity)
    const { execute, hasErrored } = useAction(updateCartItemQuantityAction)

    const product = typeof line.product === 'object' ? line.product : null
    const productTitle = typeof line.product === 'object' ? line.product.title : line.product
    const isVariant = line.isVariant
    const variantOptions = isVariant ? line.variant.map((v) => v.option).join(', ') : null
    const thumbnail = isVariant
      ? product?.variants.variantProducts.find((v) => v.id === line.variant[0].id)?.images[0]?.image
      : product?.baseProduct?.images[0]?.image

    const debouncedExecute = useMemo(
      () =>
        debounce((quantity: number) => {
          execute({ quantity, cartItemId: line.id })
        }, 1000),
      [execute, line.id],
    )

    useEffect(() => {
      if (hasErrored) {
        setOptimisticQuantity(line.quantity)
      }
    }, [hasErrored, line.quantity])

    const handleUpdateQuantity = (quantity: number) => {
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
                <h3 className="font-medium text-neutral-900">{productTitle}</h3>
                {isVariant && (
                  <p className="mt-1 text-sm text-neutral-500">{variantOptions}</p>
                )}
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {formatCurrency({ amount: line.price * optimisticQuantity, currency: 'CAD' })}
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
                    (${line.price.toFixed(2)} each)
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