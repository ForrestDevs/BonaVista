'use client'

import { CheckoutSession } from '@/lib/types/checkout'
import { EmailStep } from './steps/email-step'
import { PaymentStep } from './steps/payment-step'
import { BillingStep } from './steps/billing-step'
import { ShippingStep } from './steps/shipping-step'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { formatStripeMoney } from '@/lib/utils/formatMoney'
import { Button } from '@/components/ui/button'
import { PencilIcon } from '@/components/icons/pencil'
import { LineItemThumbnail } from './line-item-thumbnail'
import { useCheckoutSession } from './checkout-context'

export function CheckoutForm() {
  const { session, error, currentStep } = useCheckoutSession()

  return (
    <div className="w-full">
      <div className="mb-6 max-w-4xl">
        <CheckoutProgress />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm shadow-xs">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-5">
          <CheckoutSection title="Contact Information" step="email">
            <EmailStep />
          </CheckoutSection>

          <CheckoutSection title="Shipping Details" step="shipping">
            <ShippingStep />
          </CheckoutSection>

          <CheckoutSection title="Billing Information" step="billing">
            <BillingStep />
          </CheckoutSection>

          <CheckoutSection title="Payment Method" step="payment">
            <PaymentStep />
          </CheckoutSection>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-5">
            <OrderSummary />
            {session.steps.email.completed && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Your Information
                </h3>

                <div className="space-y-2">
                  {Object.entries(session.steps)
                    .filter(([key, data]) => data.completed && key !== currentStep)
                    .map(([key]) => (
                      <CompletedStepSummary
                        key={key}
                        step={key as keyof CheckoutSession['steps']}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSection({
  title,
  step,
  children,
}: {
  title: string
  step: keyof CheckoutSession['steps']
  children: React.ReactNode
}) {
  const { session, currentStep, handleEditStep } = useCheckoutSession()
  const isActive = currentStep === step
  const isCompleted = session.steps[step].completed

  // Get the step number for display
  const getStepNumber = () => {
    switch (step) {
      case 'email':
        return 1
      case 'shipping':
        return 2
      case 'billing':
        return 3
      case 'payment':
        return 4
    }
  }
  // Determine if this step should be disabled (based on previous steps completion status)
  const getIsDisabled = () => {
    if (isActive) return false

    switch (step) {
      case 'email':
        return false
      case 'shipping':
        return !session.steps.email.completed
      case 'billing':
        return !session.steps.shipping.completed
      case 'payment':
        return !session.steps.billing.completed
      default:
        return false
    }
  }

  // Determine if the edit button should be shown
  const canEdit = isCompleted && !isActive

  const isDisabled = getIsDisabled()

  return (
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isDisabled ? 'opacity-60 pointer-events-none' : '',
        isActive ? 'z-10' : 'z-0',
      )}
    >
      <div className="mb-2">
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium',
              isActive
                ? 'bg-blue-600 text-white ring-1 ring-blue-600'
                : isCompleted
                  ? 'bg-green-50 text-green-700 ring-1 ring-green-600'
                  : 'bg-gray-50 text-gray-500 ring-1 ring-gray-200',
            )}
          >
            {isCompleted && !isActive ? '✓' : getStepNumber()}
          </div>
          <h2
            className={cn(
              'ml-3 text-lg font-medium',
              isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500',
            )}
          >
            {title}
          </h2>

          {canEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleEditStep(step)}
              className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
            >
              <PencilIcon className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs sr-only">Edit</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-hidden transition-all duration-300 ease-in-out">
        <Card className={cn(!isActive && 'hidden')}>
          <CardContent>{children}</CardContent>
        </Card>
        <div className={cn(isActive && 'hidden', 'border-t border-gray-100 my-3')} />
      </div>
    </div>
  )
}

function OrderSummary() {
  const { session } = useCheckoutSession()
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          {session.lineItems.map((item) => {
            return (
              <div key={item.sku} className="flex py-3 first:pt-0 group">
                <div className="relative h-14 w-14 rounded-md border overflow-hidden shrink-0 bg-gray-50">
                  {item.thumbnailMediaId ? (
                    <LineItemThumbnail
                      key={item.sku}
                      mediaId={item.thumbnailMediaId}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-900 shrink-0 ml-2">
                      {formatStripeMoney({
                        amount: Math.round(item.price * item.quantity * 100), // Convert to cents for display
                        currency: session.currencyCode,
                      })}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{`SKU: ${item.sku}`}</p>
                  <div className="flex items-center mt-0.5">
                    <p className="text-xs text-gray-500 mr-2">Qty: {item.quantity}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t border-gray-200 pt-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatStripeMoney({
                amount: session.subtotal,
                currency: session.currencyCode,
              })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {session.shippingTotal > 0 ? (
                formatStripeMoney({
                  amount: session.shippingTotal,
                  currency: session.currencyCode,
                })
              ) : (
                <span className="font-medium text-gray-900">$0.00</span>
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium text-gray-900">
              {session.taxAmount > 0 ? (
                formatStripeMoney({
                  amount: session.taxAmount,
                  currency: session.currencyCode,
                })
              ) : (
                <span className="font-medium text-gray-900">$0.00</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatStripeMoney({
              amount: session.amount,
              currency: session.currencyCode,
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

function CompletedStepSummary({ step }: { step: keyof CheckoutSession['steps'] }) {
  const { session, handleEditStep } = useCheckoutSession()

  // Render different summary content based on step type
  const renderSummaryContent = () => {
    switch (step) {
      case 'email':
        return (
          <div>
            <p className="text-sm font-medium text-gray-700">{session.steps.email.value}</p>
          </div>
        )
      case 'shipping':
        return session.steps.shipping.address ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {session.steps.shipping.address.name}
            </p>
            <p className="text-sm text-gray-600">
              {session.steps.shipping.address.address.line1}
              {session.steps.shipping.address.address.line2 && (
                <>
                  <br />
                  {session.steps.shipping.address.address.line2}
                </>
              )}
              <br />
              {session.steps.shipping.address.address.city},{' '}
              {session.steps.shipping.address.address.state}{' '}
              {session.steps.shipping.address.address.postal_code}
            </p>
            {session.steps.shipping.method && (
              <div className="mt-2 flex">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Shipping Method: </span>
                  {session.steps.shipping.method.name}
                </p>
              </div>
            )}
          </div>
        ) : null
      case 'billing':
        // If using shipping address for billing
        if (session.steps.billing.sameAsShipping) {
          return (
            <div>
              <p className="text-sm text-gray-700">Same as shipping address</p>
            </div>
          )
        }

        // Otherwise show the billing address
        return session.steps.billing.address ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {session.steps.billing.address.name}
            </p>
            <p className="text-sm text-gray-600">
              {session.steps.billing.address.address.line1}
              {session.steps.billing.address.address.line2 && (
                <>
                  <br />
                  {session.steps.billing.address.address.line2}
                </>
              )}
              <br />
              {session.steps.billing.address.address.city},{' '}
              {session.steps.billing.address.address.state}{' '}
              {session.steps.billing.address.address.postal_code}
            </p>
          </div>
        ) : null
      default:
        return null
    }
  }

  // Get step label for display
  const getStepLabel = () => {
    switch (step) {
      case 'email':
        return 'Contact'
      case 'shipping':
        return 'Shipping'
      case 'billing':
        return 'Billing'
      case 'payment':
        return 'Payment'
    }
  }

  return (
    <Card className="gap-2 py-4">
      <CardHeader>
        <div className="flex flex-row justify-between items-center w-full">
          <CardTitle>{getStepLabel()}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => handleEditStep(step)}
          >
            <PencilIcon className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>{renderSummaryContent()}</CardContent>
    </Card>
  )
}

function CheckoutProgress() {
  const { session } = useCheckoutSession()

  const steps = [
    { key: 'email', label: 'Contact' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'billing', label: 'Billing' },
    { key: 'payment', label: 'Payment' },
  ] as const

  const completedSteps = steps.filter((step) => session.steps[step.key].completed).length
  const progress = (completedSteps / steps.length) * 100

  // Find the current active step
  let activeStepIndex = steps.findIndex((step) => !session.steps[step.key].completed)
  if (activeStepIndex === -1) activeStepIndex = steps.length - 1

  return (
    <div className="w-full mx-auto mb-10">
      {/* Desktop & Mobile progress indicator - minimalist design */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {activeStepIndex + 1} of {steps.length}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {steps[activeStepIndex]?.label || 'Complete'}
        </span>
      </div>

      {/* Pill-shaped progress bar */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Simple steps label */}
      <div className="mt-2 flex justify-end text-xs text-blue-600 font-medium">
        {completedSteps} of {steps.length} steps complete
      </div>
    </div>
  )
}
