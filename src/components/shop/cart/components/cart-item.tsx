'use client'

import type { CartItem } from '@/lib/types/cart'
import { cn } from '@/lib/utils/cn'
import { YnsLink } from '@/components/ui/link'
import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import Spinner from '@/components/ui/spinner'
import { HttpTypes } from '@medusajs/types'
// import { updateLineItem } from '@/lib/medusa/data/cart'
import { Media } from '@/components/layout/media'

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: 'full' | 'preview'
}

export function CartItem({ item, type = 'full' }: ItemProps) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant?.product ?? {}

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    // const message = await updateLineItem({
    //   lineId: item.id,
    //   quantity,
    // })
    //   .catch((err) => {
    //     setError(err.message)
    //   })
    //   .finally(() => {
    //     setUpdating(false)
    //   })
  }
  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <TableRow className="w-full" data-testid="product-row">
      <TableCell className="!pl-0 p-4 w-24">
        <YnsLink
          href={`/products/${handle}`}
          className={cn('flex', {
            'w-16': type === 'preview',
            'small:w-24 w-12': type === 'full',
          })}
        >
          <Media resource={item.thumbnail} size="sm" />
        </YnsLink>
      </TableCell>

      <TableCell className="text-left">
        <span className="text-base font-medium text-gray-900" data-testid="product-title">
          {item.product_title} 
        </span>
        {/* <LineItemOptions variant={item.variant} data-testid="product-variant" /> */}
      </TableCell>

      {type === 'full' && (
        <TableCell>
          <div className="flex gap-2 items-center w-28">
            {/* <DeleteButton id={item.id} data-testid="product-delete-button" /> */}
            {/* <CartItemSelect
                value={item.quantity}
                onChange={(value) => changeQuantity(parseInt(value.target.value))}
                className="w-14 h-10 p-4"
                data-testid="product-select-button"
              >
                {Array.from(
                  {
                    length: Math.min(
                      item.variant.inventory_quantity > 0 ? item.variant.inventory_quantity : 10,
                      10,
                    ),
                  },
                  (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  ),
                )}
              </CartItemSelect> */}
            {updating && <Spinner />}
          </div>
          {/* <ErrorMessage error={error} data-testid="product-error-message" /> */}
        </TableCell>
      )}

      {type === 'full' && (
        <TableCell className="hidden small:table-cell">
          {/* <LineItemUnitPrice item={item} region={region} style="tight" /> */}
        </TableCell>
      )}

      <TableCell className="!pr-0">
        <span
          className={cn('!pr-0', {
            'flex flex-col items-end h-full justify-center': type === 'preview',
          })}
        >
          {type === 'preview' && (
            <span className="flex gap-x-1 ">
              <span className="text-gray-500">{item.quantity}x </span>
              {/* <LineItemUnitPrice item={item} region={region} style="tight" /> */}
            </span>
          )}
          {/* <LineItemPrice item={item} region={region} style="tight" /> */}
        </span>
      </TableCell>
    </TableRow>
  )
}