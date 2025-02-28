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
import { useRouter } from 'next/navigation'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'

type CartDrawerItemProps = {
  line: CartItem
  deleteCartItemCallback: (input: { cartItemId: string }) => void
  index: number
  length: number
} & HTMLMotionProps<'li'>

export const CartDrawerItem = forwardRef<HTMLLIElement, CartDrawerItemProps>(
  (
    { line, deleteCartItemCallback, className, index, length, ...rest }: CartDrawerItemProps,
    ref,
  ) => {
    const router = useRouter()
    const [optimisticQuantity, setOptimisticQuantity] = useState(line.lineItem.quantity)
    const { execute, hasErrored } = useAction(updateCartItemQuantityAction, {
      onSuccess: () => {
        setTimeout(() => {
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
        debounce((quantity: number) => {
          execute({ quantity, cartItemId: line.id })
        }, 1000),
      [execute, line.id],
    )

    useEffect(() => {
      if (hasErrored) {
        // Rollback on error
        setOptimisticQuantity(line.lineItem.quantity)
      }
    }, [hasErrored, line.lineItem.quantity])

    const handleUpdateQuantity = (quantity: number) => {
      setOptimisticQuantity(quantity) // Immediate UI update
      debouncedExecute(quantity) // Debounced server update
    }

    return (
      <motion.li
        key={line.id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        ref={ref}
        className={className}
        {...rest}
      >
        <div className={cn(['py-1', index === 0 && 'pt-0', index === length - 1 && 'pb-0'])}>
          <motion.div
            className={cn([
              'flex items-center justify-between',
              'px-4 py-2 rounded-xl w-full min-h-[100px]',
              'bg-neutral-50 border border-gray-300',
            ])}
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
              filter: 'blur(4px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              filter: 'blur(4px)',
            }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {thumbnail ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Media
                  resource={thumbnail}
                  imgClassName="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="h-16 w-16 flex-shrink-0 rounded-md bg-neutral-100" />
            )}

            <div className="flex flex-col ml-4 gap-4 w-full h-full ">
              <div className="flex flex-row justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                  <OptimizedLink href={`/shop/product/${slug}`}>
                    <h3 className="font-medium text-neutral-900 text-base hover:underline hover:text-blue-500 transition-colors duration-200">
                      {productTitle}
                    </h3>
                  </OptimizedLink>
                  {isVariant && (
                    <div className="text-sm text-neutral-700 font-normal">{variantOptions}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-500 hover:text-red-600 hover:bg-neutral-100"
                  onClick={() => deleteCartItemCallback({ cartItemId: line.id })}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-row gap-4 items-end justify-between w-full">
                <div className="flex flex-row items-center gap-1 border border-neutral-300 divide-x divide-neutral-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-neutral-100"
                    onClick={() => handleUpdateQuantity(optimisticQuantity - 1)}
                    disabled={optimisticQuantity <= 1}
                  >
                    <MinusIcon className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm">{optimisticQuantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-neutral-100"
                    onClick={() => handleUpdateQuantity(optimisticQuantity + 1)}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-col items-end">
                  {optimisticQuantity > 1 && (
                    <p className="flex text-sm text-neutral-500">
                      {optimisticQuantity} &times; ${line.lineItem.price.toFixed(2)}
                    </p>
                  )}
                  <p className="flex text-sm text-neutral-900">
                    <span>
                      {formatCurrency({
                        amount: line.lineItem.price * optimisticQuantity,
                        currency: 'CAD',
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.li>
    )
  },
)
