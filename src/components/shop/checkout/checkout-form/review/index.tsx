'use client'

import { cn } from '@lib/utils/cn'
import { useSearchParams } from 'next/navigation'
import { Button } from '@components/ui/button'

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get('step') === 'review'

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn('flex flex-row text-3xl items-baseline', {
            'opacity-50 pointer-events-none select-none': !isOpen,
          })}
        >
          Review
        </h2>
      </div>
      {/* {isOpen && previousStepsCompleted && ( */}
      {isOpen && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-1">
                By clicking the Place Order button, you confirm that you have read, understand and
                accept our Terms of Use, Terms of Sale and Returns Policy and acknowledge that you
                have read Medusa Store&apos;s Privacy Policy.
              </p>
            </div>
          </div>
          <Button size="lg" data-testid="submit-order-button">
            Place Order
          </Button>
        </>
      )}
    </div>
  )
}

export default Review
