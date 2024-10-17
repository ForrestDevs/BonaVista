'use client'

import { cn } from '@lib/utils/cn'
import { CheckCircle } from 'lucide-react'
import { Button, buttonVariants } from '@components/ui/button'
import { Separator } from '@components/ui/separator'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { YnsLink } from '@components/ui/link'
// import { setShippingMethod } from '@lib/data/cart'
// import { formatPrice } from '@lib/utils/price'

type ShippingProps = {
  cart: any
  availableShippingMethods: any[] | null
}

const Shipping: React.FC<ShippingProps> = ({ cart, availableShippingMethods }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get('step') === 'delivery'

  const selectedShippingMethod = availableShippingMethods?.find(
    // To do: remove the previously selected shipping method instead of using the last one
    (method) => method.id === cart.shipping_methods?.at(-1)?.shipping_option_id,
  )

  const handleEdit = () => {
    router.push(pathname + '?step=delivery', { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + '?step=payment', { scroll: false })
  }

  const set = async (id: string) => {
    setIsLoading(true)
    console.log('set', id)
    setIsLoading(false)
    // await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    //   .catch((err) => {
    //     setError(err.message)
    //   })
    //   .finally(() => {
    //     setIsLoading(false)
    //   })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn('flex flex-row text-3xl items-baseline', {
            'opacity-50 pointer-events-none select-none':
              !isOpen && cart.shipping_methods?.length === 0,
          })}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && <CheckCircle />}
        </h2>
        {!isOpen && cart?.shipping_address && cart?.billing_address && cart?.email && (
          <p>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-delivery-button"
            >
              Edit
            </button>
          </p>
        )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className="pb-8">
            <RadioGroup value={selectedShippingMethod?.id} onValueChange={set}>
              {availableShippingMethods?.map((option) => {
                return (
                  <div
                    key={option.id}
                    className={cn(
                      'flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active',
                      {
                        'border-ui-border-interactive': option.id === selectedShippingMethod?.id,
                      },
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <label htmlFor={option.id} className="text-base-regular">
                        {option.name}
                      </label>
                    </div>
                    <span className="justify-self-end text-ui-fg-base">
                      {/* Replace formatPrice with appropriate function */}
                      {option.amount} {cart?.currency_code}
                    </span>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {error && <p className="text-red-500" data-testid="delivery-option-error-message">{error}</p>}

          <YnsLink
            href="/shop/checkout?step=payment"
            className={cn("mt-6", buttonVariants())}
            // onClick={handleSubmit}
            // disabled={isLoading || !cart.shipping_methods?.[0]}
            data-testid="submit-delivery-option-button"
          >
            Continue to payment
          </YnsLink>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <p className="txt-medium-plus text-ui-fg-base mb-1">Method</p>
                <p className="txt-medium text-ui-fg-subtle">
                  {selectedShippingMethod?.name}{' '}
                  0$ fix
                  {/* {formatPrice(selectedShippingMethod?.amount, cart?.currency_code)} */}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Separator className="mt-8 bg-muted" />
    </div>
  )
}

export default Shipping
