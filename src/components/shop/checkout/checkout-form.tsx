'use client'

import { Suspense, useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutSession } from '@/lib/types/checkout'
import { EmailStep } from './steps/email-step'
import { useRouter } from 'next/navigation'
import { updateCheckoutSession, updateCheckoutStep } from '@/lib/data/checkout'
import { findOrCreateCheckoutCustomer } from '@/lib/data/customer'
import { PaymentStep } from './steps/payment-step'
import { BillingStep } from './steps/billing-step'
import { ShippingStep } from './steps/shipping-step'
import { CheckoutProvider } from './checkout-context'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { formatMoney, formatStripeMoney } from '@/lib/utils/formatMoney'
import { Media } from '@/components/payload/Media'
import { Button } from '@/components/ui/button'
import { PencilIcon } from '@/components/icons/pencil'
import { LineItemThumbnail } from './line-item-thumbnail'
import { Customer } from '@payload-types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  initialSession: CheckoutSession
}

export function CheckoutForm({ initialSession }: CheckoutFormProps) {
  const [session, setSession] = useState<CheckoutSession>(initialSession)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<keyof CheckoutSession['steps'] | null>(null)

  // Update session when steps are completed
  const handleStepComplete = async (
    step: keyof CheckoutSession['steps'],
    data: Partial<CheckoutSession['steps'][typeof step]>,
  ) => {
    try {
      setIsProcessing(true)
      setError(null)
      console.log(`Completing step: ${step} with data:`, data)

      let customer: Customer | null = null

      if (step === 'email' && 'value' in data && data.value) {
        const email = data.value
        const customerResult = await findOrCreateCheckoutCustomer(email)

        customer = customerResult.customer

        if (customerResult.needsLogin) {
          setError('This email is associated with an account. Please log in to continue.')
          setIsProcessing(false)
          return
        }
      }

      // Handle customer creation/lookup for email step
      // if (step === 'email' && 'value' in data && data.value) {
      //   const email = data.value
      //   const customerResult = await findOrCreateCheckoutCustomer(email)

      //   if (customerResult.needsLogin) {
      //     setError('This email is associated with an account. Please log in to continue.')
      //     setIsProcessing(false)
      //     return
      //   }
      // }

      const updateSession = await updateCheckoutSession({
        cartId: session.cartId,
        customerId: customer?.id,
        customerEmail: customer?.email,
      })

      // Update on server
      const updatedSession = await updateCheckoutStep({
        cartId: session.cartId,
        step,
        data: {
          ...data,
          completed: true,
        },
      })

      if (updatedSession) {
        console.log(`Step ${step} completed. Setting session:`, updatedSession)
        setSession(updatedSession)

        // Reset editing step if we were editing
        if (editingStep === step) {
          console.log(`Resetting editing step from ${editingStep} to null`)
          setEditingStep(null)
        }
      }
    } catch (error) {
      console.error(`Error completing ${step} step:`, error)
      setError(`Failed to complete the ${stepLabels[step]} step. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle editing a previously completed step
  const handleEditStep = async (step: keyof CheckoutSession['steps']) => {
    console.log(`Editing step: ${step}`)

    // If editing a shipping or billing step that affects totals, we need special handling
    if ((step === 'shipping' || step === 'billing') && session.steps[step].completed) {
      try {
        setIsProcessing(true)
        setError(null)

        // Mark the step as incomplete in the session but keep the data
        const updatedSession = await updateCheckoutStep({
          cartId: session.cartId,
          step,
          data: {
            ...session.steps[step],
            // We're setting completed to false but not clearing other data
            completed: false,
          },
        })

        if (updatedSession) {
          console.log(`Updated session after preparing ${step} for edit:`, updatedSession)
          setSession(updatedSession)
        }
      } catch (err: any) {
        console.error('Error preparing step for edit:', err)
        setError('Failed to edit this step. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }

    // Activate editing mode for this step
    setEditingStep(step)
  }

  // Determine which step should be active
  const getActiveStep = (): keyof CheckoutSession['steps'] | null => {
    // If we're explicitly editing a step, that's the active one
    if (editingStep) {
      console.log(`Using explicit editing step: ${editingStep}`)
      return editingStep
    }

    // Otherwise, find the first incomplete step in order
    const stepOrder: (keyof CheckoutSession['steps'])[] = [
      'email',
      'shipping',
      'billing',
      'payment',
    ]

    // Log the current completion status of all steps
    console.log('Step completion status:', {
      email: session.steps.email.completed,
      shipping: session.steps.shipping.completed,
      billing: session.steps.billing.completed,
      payment: session.steps.payment.completed,
    })

    for (const step of stepOrder) {
      if (!session.steps[step].completed) {
        console.log(`Found first incomplete step: ${step}`)
        return step
      }
    }

    console.log('All steps completed, defaulting to payment step')
    return 'payment' // Default to payment step if all are completed
  }

  const activeStep = getActiveStep()

  // Map step keys to friendly names
  const stepLabels: Record<keyof CheckoutSession['steps'], string> = {
    email: 'Contact',
    shipping: 'Shipping',
    billing: 'Billing',
    payment: 'Payment',
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: session.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0F172A',
            colorBackground: '#ffffff',
            colorText: '#1e293b',
            colorDanger: '#ef4444',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutProvider initialSession={session}>
        <div className="w-full">
          {/* Progress bar */}
          <div className="mb-6 max-w-4xl">
            <CheckoutProgress session={session} />

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm shadow-xs">
                {error}
              </div>
            )}
          </div>

          {/* Main checkout area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Form steps (left column on desktop) */}
            <div className="lg:col-span-7 space-y-5">
              <CheckoutSection
                title="Contact Information"
                isCompleted={session.steps.email.completed && activeStep !== 'email'}
                isActive={activeStep === 'email'}
                stepNumber={1}
                onEdit={
                  session.steps.email.completed && activeStep !== 'email'
                    ? () => handleEditStep('email')
                    : undefined
                }
              >
                {activeStep === 'email' ? (
                  <EmailStep
                    initialEmail={session.steps.email.value}
                    onComplete={(data) => handleStepComplete('email', data)}
                    isProcessing={isProcessing}
                  />
                ) : session.steps.email.completed ? (
                  <CompletedStepSummary
                    step="email"
                    data={session.steps.email}
                    stepLabel={stepLabels.email}
                    session={session}
                    onEdit={() => handleEditStep('email')}
                  />
                ) : null}
              </CheckoutSection>

              <CheckoutSection
                title="Shipping Details"
                isCompleted={session.steps.shipping.completed && activeStep !== 'shipping'}
                isActive={activeStep === 'shipping'}
                stepNumber={2}
                isDisabled={activeStep !== 'shipping' && !session.steps.shipping.completed}
                onEdit={
                  session.steps.shipping.completed && activeStep !== 'shipping'
                    ? () => handleEditStep('shipping')
                    : undefined
                }
              >
                {activeStep === 'shipping' ? (
                  <ShippingStep
                    initialAddress={session.steps.shipping.address}
                    onComplete={handleStepComplete.bind(null, 'shipping')}
                    isProcessing={isProcessing}
                    isDisabled={!session.steps.email.completed}
                  />
                ) : session.steps.shipping.completed ? (
                  <CompletedStepSummary
                    step="shipping"
                    data={session.steps.shipping}
                    stepLabel={stepLabels.shipping}
                    session={session}
                    onEdit={() => handleEditStep('shipping')}
                  />
                ) : null}
              </CheckoutSection>

              <CheckoutSection
                title="Billing Information"
                isCompleted={session.steps.billing.completed && activeStep !== 'billing'}
                isActive={activeStep === 'billing'}
                stepNumber={3}
                isDisabled={
                  !session.steps.shipping.completed ||
                  (activeStep !== 'billing' && !session.steps.billing.completed)
                }
                onEdit={
                  session.steps.billing.completed && activeStep !== 'billing'
                    ? () => handleEditStep('billing')
                    : undefined
                }
              >
                {activeStep === 'billing' ? (
                  <BillingStep
                    initialAddress={session.steps.billing.address}
                    shippingAddress={session.steps.shipping.address}
                    initialSameAsShipping={session.steps.billing.sameAsShipping}
                    onComplete={handleStepComplete.bind(null, 'billing')}
                    isProcessing={isProcessing}
                    isDisabled={!session.steps.shipping.completed}
                  />
                ) : session.steps.billing.completed ? (
                  <CompletedStepSummary
                    step="billing"
                    data={session.steps.billing}
                    stepLabel={stepLabels.billing}
                    session={session}
                    onEdit={() => handleEditStep('billing')}
                  />
                ) : null}
              </CheckoutSection>

              <CheckoutSection
                title="Payment Method"
                isCompleted={session.steps.payment.completed}
                isActive={activeStep === 'payment'}
                stepNumber={4}
                isDisabled={
                  !session.steps.billing.completed ||
                  (activeStep !== 'payment' && !session.steps.payment.completed)
                }
              >
                {activeStep === 'payment' ? (
                  <PaymentStep
                    session={session}
                    isProcessing={isProcessing}
                    isDisabled={!session.steps.billing.completed}
                  />
                ) : session.steps.payment.completed ? (
                  <CompletedStepSummary
                    step="payment"
                    data={session.steps.payment}
                    stepLabel={stepLabels.payment}
                    session={session}
                    onEdit={() => handleEditStep('payment')}
                  />
                ) : null}
              </CheckoutSection>
            </div>

            {/* Order summary and completed steps (right column on desktop) */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-5">
                <OrderSummary session={session} />

                {/* Completed steps summary */}
                {session.steps.email.completed && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Your Information
                    </h3>

                    <div className="space-y-2">
                      {Object.entries(session.steps)
                        .filter(([key, data]) => data.completed && key !== activeStep)
                        .map(([key, data]) => (
                          <CompletedStepSummary
                            key={key}
                            step={key as keyof CheckoutSession['steps']}
                            data={data}
                            stepLabel={stepLabels[key as keyof CheckoutSession['steps']]}
                            session={session}
                            onEdit={() => handleEditStep(key as keyof CheckoutSession['steps'])}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </Elements>
  )
}

// Order Summary Component
function OrderSummary({ session }: { session: CheckoutSession }) {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-xs">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>
      </div>

      {/* Line items */}
      <div className="p-4 space-y-4">
        <div className="divide-y divide-gray-100">
          {session.lineItems.map((item) => {
            console.log('item', item)
            return (
              <div key={item.sku} className="flex py-3 first:pt-0 last:pb-0 group">
                <div className="relative h-14 w-14 rounded-md border overflow-hidden shrink-0 bg-gray-50">
                  {item.thumbnailMediaId ? (
                    <LineItemThumbnail
                    
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

        {/* Totals */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
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
                <span className="text-gray-500">Calculated next</span>
              )}
            </span>
          </div>

          {session.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">
                {formatStripeMoney({
                  amount: session.taxAmount,
                  currency: session.currencyCode,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Grand total */}
        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">
            {formatStripeMoney({
              amount: session.amount,
              currency: session.currencyCode,
            })}
          </span>
        </div>
      </div>
    </Card>
  )
}

// Completed Step Summary
function CompletedStepSummary({
  step,
  data,
  stepLabel,
  session,
  onEdit,
}: {
  step: keyof CheckoutSession['steps']
  data: any
  stepLabel: string
  session: CheckoutSession
  onEdit: () => void
}) {
  // Render different summary content based on step type
  const renderSummaryContent = () => {
    switch (step) {
      case 'email':
        return <p className="text-sm text-gray-800">{data.value}</p>
      case 'shipping':
        const address = data.address
        return address ? (
          <div className="text-sm space-y-0.5">
            <p className="font-medium text-gray-800">{address.name}</p>
            <p className="text-gray-600">{address.address.line1}</p>
            {address.address.line2 && <p className="text-gray-600">{address.address.line2}</p>}
            <p className="text-gray-600">
              {address.address.city}, {address.address.state} {address.address.postal_code}
            </p>
            <p className="text-blue-600 text-xs mt-1">{data.method?.name || 'Standard Shipping'}</p>
          </div>
        ) : null
      case 'billing':
        if (data.sameAsShipping) {
          return <p className="text-sm text-gray-600">Same as shipping address</p>
        }
        const billingAddress = data.address
        return billingAddress ? (
          <div className="text-sm space-y-0.5">
            <p className="font-medium text-gray-800">{billingAddress.name}</p>
            <p className="text-gray-600">{billingAddress.address.line1}</p>
            {billingAddress.address.line2 && (
              <p className="text-gray-600">{billingAddress.address.line2}</p>
            )}
            <p className="text-gray-600">
              {billingAddress.address.city}, {billingAddress.address.state}{' '}
              {billingAddress.address.postal_code}
            </p>
          </div>
        ) : null
      default:
        return <p className="text-sm text-gray-600">Completed</p>
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs hover:shadow-none transition-shadow duration-200">
      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-medium text-gray-900">{stepLabel}</h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={onEdit}
          >
            <PencilIcon className="w-3 h-3" />
            <span className="text-xs sr-only">Edit</span>
          </Button>
        </div>
        <div>{renderSummaryContent()}</div>
      </div>
    </div>
  )
}

interface CheckoutSectionProps {
  title: string
  children: React.ReactNode
  isCompleted: boolean
  isActive: boolean
  stepNumber: number
  isDisabled?: boolean
  onEdit?: () => void
}

function CheckoutSection({
  title,
  children,
  isCompleted,
  isActive,
  stepNumber,
  isDisabled = false,
  onEdit,
}: CheckoutSectionProps) {
  // Show step content if it's active
  const showContent = isActive

  return (
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isDisabled ? 'opacity-60 pointer-events-none' : '',
        isActive ? 'z-10' : 'z-0',
      )}
    >
      {/* Section Header */}
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
            {isCompleted && !isActive ? '✓' : stepNumber}
          </div>
          <h2
            className={cn(
              'ml-2.5 text-base font-medium',
              isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-500',
            )}
          >
            {title}
          </h2>

          {isCompleted && !isActive && onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
            >
              <PencilIcon className="h-3 w-3" />
              <span className="text-xs sr-only">Edit</span>
            </Button>
          )}
        </div>
      </div>

      {/* Section Content */}
      {showContent ? (
        <div className="mt-4 overflow-hidden transition-all duration-300 ease-in">
          <Card className={cn('border p-4 shadow-xs', isActive && 'ring-1 ring-blue-200 bg-white')}>
            {children}
          </Card>
        </div>
      ) : (
        <div className="border-t border-gray-100 my-3" />
      )}
    </div>
  )
}

function CheckoutProgress({ session }: { session: CheckoutSession }) {
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
