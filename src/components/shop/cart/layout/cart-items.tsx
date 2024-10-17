import React from 'react'
import type { CartItems } from '@payload-types'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@components/ui/table'
import SkeletonLineItem from '../../skeletons/components/skeleton-line-item'
import { CartItem } from '../components/cart-item'

type ItemsTemplateProps = {
  items: CartItems
}

export function CartItems({ items }: ItemsTemplateProps) {
  return (
    <div>
      <div className="pb-3 flex items-center">
        <h2 className="text-4xl leading-[2.75rem] font-bold">Cart</h2>
      </div>
      <Table>
        <TableHeader className="border-t-0">
          <TableRow className="text-ui-fg-subtle txt-medium-plus">
            <TableHead className="!pl-0">Item</TableHead>
            <TableHead></TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="hidden small:table-cell">Price</TableHead>
            <TableHead className="!pr-0 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items
            ? items
                // .sort((a, b) => {
                //   return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
                // })
                .map((item) => {
                  return <CartItem key={item.id} item={item} />
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </TableBody>
      </Table>
    </div>
  )
}
