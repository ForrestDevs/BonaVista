import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { getCart } from '@/lib/data/cart'
import { CartDrawerWrapper } from './cart-drawer-wrapper'
import { CartDrawerItemList } from './cart-drawer-item-list'
import { formatCurrency } from '@/lib/utils/formatMoney'

export async function CartDrawer() {
  const cart = await getCart(2)

  if (!cart || cart.items.length === 0) {
    return null
  }

  const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartDrawerWrapper>
      <div className="flex flex-col max-h-[75vh] sm:max-h-none sm:h-full">
        <h2 className="text-lg font-semibold text-neutral-900 ml-6 pt-2 sm:pt-6 pb-2">
          My Cart <span className="text-sm text-neutral-600">({cart.items.length} items)</span>
        </h2>
        <CartDrawerItemList items={cart.items} />

        <div className="border-t border-neutral-200 px-4 py-4 sm:px-6">
          <div
            id="cart-overlay-description"
            className="flex justify-between text-base font-medium text-neutral-900"
          >
            <p>Subtotal</p>
            <p>{formatCurrency({ amount: total, currency: 'CAD' })}</p>
          </div>
          <Button asChild={true} size={'lg'} className="mt-4 w-full rounded-full text-lg">
            <YnsLink href="/shop/cart">Go to Cart</YnsLink>
          </Button>
        </div>
      </div>
    </CartDrawerWrapper>
  )
}
