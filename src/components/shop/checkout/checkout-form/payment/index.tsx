'use client'

import { cn } from '@lib/utils/cn'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { CardElement } from '@stripe/react-stripe-js'
import type { StripeCardElementOptions } from '@stripe/stripe-js'
import { CheckCircle, CreditCard } from 'lucide-react'
import { Button, buttonVariants } from '@components/ui/button'
import { Separator } from '@components/ui/separator'
import { Message } from '@components/payload/Message'
import { StripeContext } from '@components/shop/checkout/payment-wrapper'
import { RadioGroupItem, RadioGroup } from '@components/ui/radio-group'
import { YnsLink } from '@components/ui/link'
// import { ErrorMessage } from '@components/ui/error-message'
// import { PaymentContainer } from '@components/shop/checkout/checkout-form/payment/payment-container'
// import { isStripe, paymentInfoMap } from '@lib/constants'

// import { initiatePaymentSession } from '@lib/data/cart'

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === 'pending',
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? '',
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get('step') === 'payment'

  // const isStripePayment = isStripe(activeSession?.provider_id)
  const stripeReady = useContext(StripeContext)

  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady = (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: 'Inter, sans-serif',
          color: '#424270',
          '::placeholder': {
            color: 'rgb(107 114 128)',
          },
        },
      },
      classes: {
        base: 'pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out',
      },
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const handleEdit = () => {
    router.push(pathname + '?' + createQueryString('step', 'payment'), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // const shouldInputCard = isStripe(selectedPaymentMethod) && !activeSession
      // if (!activeSession) {
      //   await initiatePaymentSession(cart, {
      //     provider_id: selectedPaymentMethod,
      //   })
      // }
      // if (!shouldInputCard) {
      //   return router.push(pathname + '?' + createQueryString('step', 'review'), {
      //     scroll: false,
      //   })
      // }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn('flex flex-row text-3xl items-baseline', {
            'opacity-50 pointer-events-none select-none': !isOpen && !paymentReady,
          })}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircle />}
        </h2>
        {!isOpen && paymentReady && (
          <p>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </p>
        )}
      </div>
      <div>
        <div className={isOpen ? 'block' : 'hidden'}>
          {/* {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value: string) => setSelectedPaymentMethod(value)}
              >
                {availablePaymentMethods
                  .sort((a, b) => {
                    return a.provider_id > b.provider_id ? 1 : -1
                  })
                  .map((paymentMethod) => {
                    return (
                      <div key={paymentMethod.id}>
                        <RadioGroupItem value={paymentMethod.id} />
                      </div>
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        key={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )
                  })}
              </RadioGroup>
              {isStripePayment && stripeReady && (
                <div className="mt-5 transition-all duration-150 ease-in-out">
                  <p className="txt-medium-plus text-ui-fg-base mb-1">Enter your card details:</p>

                  <CardElement
                    options={useOptions as StripeCardElementOptions}
                    onChange={(e) => {
                      setCardBrand(e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1))
                      setError(e.error?.message || null)
                      setCardComplete(e.complete)
                    }}
                  />
                </div>
              )}
            </>
          )} */}

          {/* {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <p className="txt-medium-plus text-ui-fg-base mb-1">Payment method</p>
              <p className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
                Gift card
              </p>
            </div>
          )} */}

          <Message error={error} data-testid="payment-method-error-message" />

          <YnsLink
            href="/shop/checkout?step=review"
            className={cn('mt-6', buttonVariants())}
            // onClick={handleSubmit}
            // disabled={
            //   (isStripePayment && !cardComplete) || (!selectedPaymentMethod && !paidByGiftcard)
            // }
            data-testid="submit-payment-button"
          >
            Continue to review
            {/* {!activeSession && isStripe(selectedPaymentMethod)
              ? ' Enter card details'
              : 'Continue to review'} */}
          </YnsLink>
        </div>

        <div className={isOpen ? 'hidden' : 'block'}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <p className="txt-medium-plus text-ui-fg-base mb-1">Payment method</p>
                <p className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
                  {/* {paymentInfoMap[selectedPaymentMethod]?.title || selectedPaymentMethod} */}
                </p>
              </div>
              <div className="flex flex-col w-1/3">
                <p className="txt-medium-plus text-ui-fg-base mb-1">Payment details</p>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <div className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {/* {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />} */}
                  </div>
                  <p>
                    Another step will appear
                    {/* {isStripe(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : 'Another step will appear'} */}
                  </p>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <p className="txt-medium-plus text-ui-fg-base mb-1">Payment method</p>
              <p className="txt-medium text-ui-fg-subtle" data-testid="payment-method-summary">
                Gift card
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <Separator className="mt-8 bg-muted" />
    </div>
  )
}

export default Payment
