// import { getLocale, getTranslations } from '@/i18n/server'
// import { formatMoney, formatProductName } from '@/lib/utils/for'
import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'
import { getCart } from '@/lib/data/cart'
import { calculateCartTotalNetWithoutShipping } from '@/lib/data/cart/utils'
import { Media } from '@/components/payload/Media'
import { CartAsideDrawer } from './cart-aside-drawer'
import { TrashIcon } from 'lucide-react'
import { MinusIcon } from 'lucide-react'
import { PlusIcon } from 'lucide-react'
import { CartItem } from '@/lib/types/cart'

export async function CartModalPage() {
  const cart = await getCart(2)

  if (!cart || cart.items.length === 0) {
    return null
  }

  const total = calculateCartTotalNetWithoutShipping(cart)

  return (
    <CartAsideDrawer>
      <div className="flex h-full min-h-[80vh] flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-700">Cart</h2>
            <YnsLink replace href="/shop/cart" className="text-sm text-muted-foreground underline">
              Open full view
            </YnsLink>
          </div>

          <div className="mt-8">
            <ul role="list" className="-my-6 divide-y divide-neutral-200">
              {cart.items.map((line) => (
                <CartItemRow key={line.id} line={line} />
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
          <div
            id="cart-overlay-description"
            className="flex justify-between text-base font-medium text-neutral-900"
          >
            <p>Subtotal</p>
            <p>$ {total.toFixed(2)}</p>
          </div>
          <Button asChild={true} size={'lg'} className="mt-6 w-full rounded-full text-lg">
            <YnsLink href="/shop/cart">Go to payment</YnsLink>
          </Button>
        </div>
      </div>

      {/* {searchParams.add && <CartModalAddSideEffect productId={searchParams.add} />} } */}
    </CartAsideDrawer>
  )
}

function CartItemRow({ line }: { line: CartItem }) {
  const product = typeof line.product === 'object' ? line.product : null
  const productTitle = typeof line.product === 'object' ? line.product.title : line.product
  const isVariant = line.isVariant
  const variantOptions = isVariant ? line.variant.map((v) => v.option).join(', ') : null
  const thumbnail = isVariant
    ? product?.variants.variantProducts.find((v) => v.id === line.variant[0].id)?.images[0]?.image
    : product?.baseProduct?.images[0]?.image

  return (
    <li className="flex items-center gap-4 py-6">
      {thumbnail ? (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
          <Media resource={thumbnail} className="h-full w-full object-cover object-center" />
        </div>
      ) : (
        <div className="h-24 w-24 flex-shrink-0 rounded-md bg-neutral-100" />
      )}

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-neutral-900">
              {productTitle}
              {isVariant && (
                <span className="ml-1 text-sm text-neutral-500">({variantOptions})</span>
              )}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">${line.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="min-w-[2rem] text-center">{line.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}
