'use client'

import { Cart, CartItems } from '@payload-types'
import { Table, TableBody } from '@components/ui/table'
import { cn } from '@lib/utils/cn'
import SkeletonLineItem from '@components/shop/skeletons/components/skeleton-line-item'
import { CartItem } from '@components/shop/cart/components/cart-item'

type CartPreviewProps = {
  items?: CartItems
}

export function CartPreview({ items }: CartPreviewProps) {
  const hasOverflow = items && items.length > 4

  return (
    <div
      className={cn({
        'pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]': hasOverflow,
      })}
    >
      <Table>
        <TableBody data-testid="items-table">
          {items
            ? items
                .sort((a, b) => {
                  return a.quantity > b.quantity ? -1 : 1
                })
                .map((item) => {
                  return <CartItem key={item.id} item={item} type="preview" />
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </TableBody>
      </Table>
    </div>
  )
}
