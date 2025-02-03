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
              {cart.items.map((line) => {
                const product = typeof line.product === 'object' ? line.product : null
                const productTitle =
                  typeof line.product === 'object' ? line.product.title : line.product
                const isVariant = line.isVariant
                const variantOptions = isVariant
                  ? line.variant.map((v) => v.option).join(', ')
                  : null
                // const thumbnail = isVariant
                //   ? product?.variants.variantProducts.find((v) =>
                //       v.options.every((o, i) => o === line.variant[i].option),
                //     )?.images[0]?.image
                //   : product?.baseProduct?.images[0]?.image

                return (
                  <li
                    key={line.id}
                    className="grid grid-cols-[4rem,1fr,max-content] grid-rows-[auto,auto] gap-x-4 gap-y-2 py-6"
                  >
                    {/* {thumbnail ? (
                      <div className="relative h-16 w-16">
                        <Media resource={thumbnail} />
                      </div>
                    ) : (
                      <div className="col-span-1 row-span-2" />
                    )} */}

                    <h3 className="-mt-1 font-semibold leading-tight">
                      {productTitle} {isVariant ? `- ${variantOptions}` : ''}
                    </h3>
                    <p className="text-sm font-medium leading-none">$ {line.price.toFixed(2)}</p>
                    <p className="self-end text-sm font-medium text-muted-foreground">
                      Qty: {line.quantity}
                    </p>

                    <Button variant="ghost" size="icon">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MinusIcon className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </li>
                )
              })}
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
