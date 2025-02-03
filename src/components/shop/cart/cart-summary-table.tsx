import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Cart } from '@payload-types'
import { calculateCartTotalPossiblyWithTax } from '@/lib/data/cart/utils'
import { CartItemQuantity } from './cart-item-quantity'
import CartItemDetails, { CartItemThumbnail } from './cart-item-details'

export const CartSummaryTable = ({ cart }: { cart: Cart }) => {
 
  const total = calculateCartTotalPossiblyWithTax(cart)
  const shippingCost = 25.0
  const taxRate = 0.13
  const taxCost = (total + shippingCost) * taxRate
  const totalWithTax = total + shippingCost + taxCost

  return (
    <form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-12 pr-3 text-left !pl-0 font-semibold text-gray-700">
              Item
            </TableHead>
            <TableHead className="h-12 pr-3 text-left "></TableHead>
            <TableHead className="h-12 pr-3 text-left font-semibold text-gray-700">
              Quantity
            </TableHead>
            <TableHead className="h-12 pr-3 text-left hidden md:table-cell font-semibold text-gray-700">
              Price
            </TableHead>
            <TableHead className="h-12 !pr-0 text-right font-semibold text-gray-700">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.items.map((line) => (
            <TableRow key={line.id} className="w-full">
              <TableCell className="h-12 !pl-0 w-24 p-4">
                <CartItemThumbnail item={line} />
              </TableCell>
              <TableCell className="h-12 pr-3 text-left p-0 py-2">
                <CartItemDetails item={line} />
              </TableCell>
              <TableCell className="h-12 pr-3">
                <CartItemQuantity item={line} />
              </TableCell>
              <TableCell className="h-12 pr-3 hidden md:table-cell">
                <div className="flex flex-col text-muted-foreground justify-center h-full">
                  <span className="text-sm">${line.price.toFixed(2)}</span>
                </div>
              </TableCell>
              <TableCell className="h-12 !pr-0">
                <div className="flex flex-col gap-x-2 text-muted-foreground items-end">
                  <span className="text-right text-sm">
                    ${(line.price * line.quantity).toFixed(2)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>Subtotal</TableCell>
            <TableCell className="hidden md:table-cell"></TableCell>
            <TableCell className="text-right">${total.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Shipping</TableCell>
            <TableCell className="hidden md:table-cell"></TableCell>
            <TableCell className="text-right">${shippingCost.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Tax ({(taxRate * 100).toFixed(0)}%)</TableCell>
            <TableCell className="hidden md:table-cell"></TableCell>
            <TableCell className="text-right">${taxCost.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="font-bold">
              Total
            </TableCell>
            <TableCell className="hidden md:table-cell"></TableCell>
            <TableCell className="text-right font-bold">${totalWithTax.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </form>
  )
}
