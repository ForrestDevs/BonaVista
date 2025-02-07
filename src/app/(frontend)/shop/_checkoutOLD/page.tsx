// 'use client'

// import { useCheckout } from './context'
// import {
//   AddressElement,
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from '@stripe/react-stripe-js'
// import { useEffect, useRef, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { AlertCircle, Loader2 } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { useRouter } from 'next/navigation'
// import { useDidUpdate } from '@/lib/hooks/lifecycle'
// import { LockClosedIcon } from '@radix-ui/react-icons'
// import { AddressSchema, getAddressSchema } from '@/lib/validations/checkout'
// import { ShippingRatesSection } from '@/components/shop/shipping-rates-section'
// import { CustomerDTO } from '@/lib/data/customer'
// import { getAvailableShippingMethods } from '@/lib/data/shop'
// import { ShippingOption } from '@payload-types'

// type Props = {
//   customer: CustomerDTO | null
// }

// type InitialPaymentData = {
//   id: string
//   amount: number
//   client_secret: string
//   status: 'pending'
//   currency: string
// }

// const mockLineItems = [
//   { id: 1, description: 'Item 1', amount: 100 },
//   { id: 2, description: 'Item 2', amount: 25 },
//   { id: 3, description: 'Item 3', amount: 50 },
// ]

// export default function CheckoutPage({ customer }: Props) {
//   const {
//     isReady,
//     setIsReady,
//     formData,
//     updateFormData,
//     isLoading,
//     setIsLoading,
//     formErrorMessage,
//     setFormErrorMessage,
//     sameAsShipping,
//     setSameAsShipping,
//     isBillingAddressPending,
//     isTransitioning,
//     transition,
//     debouncedBillingAddress,
//   } = useCheckout()

//   const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null)
//   const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null)
//   const [shippingAddress, setShippingAddress] = useState<{
//     postalCode: string | null
//     address: any
//   }>({
//     postalCode: null,
//     address: null,
//   })

//   // Calculate cart total
//   // const cartTotal = mockLineItems.reduce((sum, item) => sum + item.amount, 0)

//   // Fetch shipping options when component mounts
//   useEffect(() => {
//     const fetchShippingOptions = async () => {
//       const result = await getAvailableShippingMethods()
//       setShippingOptions(result)
//     }
//     fetchShippingOptions()
//   }, [])

//   const addressSchema = getAddressSchema({
//     cityRequired: 'City is required',
//     countryRequired: 'Country is required',
//     line1Required: 'Line 1 is required',
//     nameRequired: 'Name is required',
//     postalCodeRequired: 'Postal code is required',
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setFormErrorMessage(null)

//     if (!stripe || !elements) {
//       console.warn('Stripe or Elements not ready')
//       setFormErrorMessage('Error loading checkout. Please try again.')
//       setIsLoading(false)
//       return
//     }

//     const shippingAddressElement = elements.getElement('address')
//     if (!shippingAddressElement) {
//       console.warn('Address Element expected to exist but not found')
//       setFormErrorMessage('Error loading checkout. Please try again.')
//       setIsLoading(false)
//       return
//     }

//     try {
//       // // Get shipping address from the AddressElement
//       // const shippingAddressObject = await shippingAddressElement.getValue()

//       // const shippingAddress: Partial<AddressSchema> = {
//       //   name: shippingAddressObject.value.name,
//       //   city: shippingAddressObject.value.address.city,
//       //   country: shippingAddressObject.value.address.country,
//       //   line1: shippingAddressObject.value.address.line1,
//       //   line2: shippingAddressObject.value.address.line2,
//       //   postalCode: shippingAddressObject.value.address.postal_code,
//       //   state: shippingAddressObject.value.address.state,
//       //   phone: shippingAddressObject.value.phone,
//       // }

//       // // Use shipping address as billing if same-as-shipping is checked
//       // const billingAddress: Partial<AddressSchema> = sameAsShipping
//       //   ? shippingAddress
//       //   : formData.billing

//       // // Validate both addresses
//       // const validatedBillingAddress = addressSchema.safeParse(billingAddress)
//       // const validatedShippingAddress = addressSchema.safeParse(shippingAddress)

//       // if (!validatedShippingAddress.success || !validatedBillingAddress.success) {
//       //   console.error('Validation failed', {
//       //     validatedShippingAddress,
//       //     validatedBillingAddress,
//       //   })
//       //   setFormErrorMessage('Please fill in all required fields')
//       //   setIsLoading(false)
//       //   return
//       // }

//       // // Create initial order with pending status
//       // const initialPaymentData: InitialPaymentData = {
//       //   id: '',
//       //   amount: 0,
//       //   client_secret: '',
//       //   status: 'pending',
//       //   currency: 'usd',
//       // }

//       // const order = await createOrder(customer, initialPaymentData as unknown as PaymentIntent)

//       // if (!order) {
//       //   setFormErrorMessage('Error creating order. Please try again.')
//       //   setIsLoading(false)
//       //   return
//       // }
//       console.log('formData', formData)

//       // Confirm the payment with Stripe
//       const result = await stripe.confirmPayment({
//         elements,
//         redirect: 'if_required',
//         confirmParams: {
//           return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/confirmation`,
//           // payment_method_data: {
//           //   billing_details: {
//           //     email: formData.email ?? undefined,
//           //     name: formData.firstName + ' ' + formData.lastName,
//           //     phone: formData.phone ?? undefined,
//           //     address: {
//           //       city: debouncedBillingAddress.address?.city ?? '',
//           //       country: debouncedBillingAddress.address?.country ?? '',
//           //       line1: debouncedBillingAddress.address?.line1 ?? '',
//           //       line2: debouncedBillingAddress.address?.line2 ?? '',
//           //       postal_code: debouncedBillingAddress.address?.postal_code ?? '',
//           //       state: debouncedBillingAddress.address?.state ?? '',
//           //     },
//           //   },
//           // },
//           // shipping: {
//           //   name: formData.shipping.name,
//           //   phone: formData.shipping.phone ?? undefined,
//           //   address: {
//           //     city: formData.shipping.address?.city ?? '',
//           //     country: formData.shipping.address?.country ?? '',
//           //     line1: formData.shipping.address?.line1 ?? '',
//           //     line2: formData.shipping.address?.line2 ?? '',
//           //     postal_code: formData.shipping.address?.postal_code ?? '',
//           //     state: formData.shipping.address?.state ?? '',
//           //   },
//           // },
//         },
//       })

//       if (result.error) {
//         // Handle specific error cases
//         switch (result.error.type) {
//           case 'card_error':
//           case 'validation_error':
//             setFormErrorMessage(result.error.message)
//             break
//           default:
//             setFormErrorMessage('An unexpected error occurred.')
//         }
//         console.error('Payment error:', result.error)
//         setIsLoading(false)
//       } else {
//         // clear cart cookie after successful payment for payment methods that do not require redirect
//         // for payment methods that require redirect, we clear the cookie on the success page
//         const params = new URLSearchParams({
//           payment_intent: result.paymentIntent.id,
//           payment_intent_client_secret: result.paymentIntent.client_secret ?? '',
//         })
//         router.push('/shop/confirmation?' + params.toString())
//         // deliberately not setting isLoading to false here to prevent the button to flicker back to "Pay now" before redirecting
//         // setIsLoading(false);
//       }
//     } catch (error) {
//       console.error('Submission error:', error)
//       setFormErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
//       setIsLoading(false)
//     }
//   }

//   const stripe = useStripe()
//   const router = useRouter()
//   // elements are mutable and can change during the lifecycle of the component
//   // keep a mutable ref so that useEffects are not triggered when elements change
//   const elements = useElements()
//   const elementsRef = useRef(elements)
//   elementsRef.current = elements

//   useDidUpdate(() => {
//     transition(async () => {
//       //   await saveBillingAddressAction({ billingAddress: debouncedBillingAddress })
//       await elementsRef.current?.fetchUpdates()
//       router.refresh()
//     })
//   }, [debouncedBillingAddress, router])

//   const readyToRender =
//     stripe && elements && isReady.address && isReady.linkAuthentication && isReady.payment

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-center mb-8">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <LockClosedIcon className="h-4 w-4" />
//             <span>Secure Checkout</span>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="space-y-6">
//                 <div className={!isReady.linkAuthentication ? 'hidden' : ''}>
//                   <h2 className="text-lg font-medium mb-4">Contact Info</h2>
//                   <LinkAuthenticationElement
//                     onReady={() => setIsReady('linkAuthentication', true)}
//                     onChange={(event) => {
//                       updateFormData('email', event.value.email)
//                     }}
//                     options={{
//                       defaultValues: {
//                         email: formData.email || '',
//                       },
//                     }}
//                   />
//                 </div>

//                 <div className={!isReady.address ? 'hidden' : ''}>
//                   <h2 className="text-lg font-medium mb-4">Shipping</h2>
//                   <AddressElement
//                     onReady={() => setIsReady('address', true)}
//                     onChange={(e) => {
//                       // Update shipping address when address changes
//                       setShippingAddress({
//                         postalCode: e.value.address.postal_code,
//                         address: e.value.address,
//                       })

//                       if (!sameAsShipping || !isReady.address) {
//                         return
//                       }
//                       updateFormData('shipping', {
//                         name: e.value.name,
//                         city: e.value.address.city,
//                         country: e.value.address.country,
//                         line1: e.value.address.line1,
//                         line2: e.value.address.line2 ?? null,
//                         postalCode: e.value.address.postal_code,
//                         state: e.value.address.state ?? null,
//                         phone: e.value.phone ?? null,
//                       })

//                       updateFormData('billing', {
//                         name: e.value.name,
//                         city: e.value.address.city,
//                         country: e.value.address.country,
//                         line1: e.value.address.line1,
//                         line2: e.value.address.line2 ?? null,
//                         postalCode: e.value.address.postal_code,
//                         state: e.value.address.state ?? null,
//                         phone: e.value.phone ?? null,
//                         taxId: '',
//                         email: formData.email,
//                       })
//                     }}
//                     options={{
//                       mode: 'shipping',
//                       fields: { phone: 'always' },
//                       validation: { phone: { required: 'auto' } },
//                       display: {
//                         name: 'split',
//                       },
//                       defaultValues: {
//                         firstName: formData?.firstName ?? '',
//                         lastName: formData?.lastName ?? '',
//                         phone: formData?.phone ?? '',
//                         address: {
//                           country: '',
//                           city: '',
//                           postal_code: '',
//                           line1: '',
//                           line2: '',
//                           state: '',
//                         },
//                       },
//                     }}
//                   />

//                   {/* Show shipping options only when address is entered */}
//                   {shippingAddress.postalCode && (
//                     <div className="mt-6">
//                       <ShippingRatesSection
//                         shippingOptions={shippingOptions}
//                         selectedOptionId={selectedShippingId}
//                         onSelect={setSelectedShippingId}
//                         postalCode={shippingAddress.postalCode}
//                         cartTotal={260}
//                         isLoading={!shippingOptions}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className={!isReady.payment ? 'hidden' : ''}>
//                   <div className="space-y-4">
//                     <h2 className="text-lg font-medium">Payment</h2>
//                     <PaymentElement
//                       onReady={() => setIsReady('payment', true)}
//                       options={{
//                         layout: {
//                           type: 'tabs',
//                           defaultCollapsed: false,
//                           radios: true,
//                           spacedAccordionItems: true,
//                         },
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {formErrorMessage && (
//                   <Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
//                     <AlertCircle className="-mt-1 h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{formErrorMessage}</AlertDescription>
//                   </Alert>
//                 )}

//                 <Button
//                   type="submit"
//                   className="w-full rounded-full text-lg"
//                   size="lg"
//                   disabled={!readyToRender || isLoading || isTransitioning}
//                 >
//                   {isLoading || isTransitioning ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   ) : (
//                     'Pay Now'
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>

//           <div className="lg:col-span-1">
//             <Card className="p-6 sticky top-6">
//               <h2 className="text-lg font-medium mb-4">Order Summary</h2>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   {mockLineItems.map((item) => (
//                     <div key={item.id} className="flex justify-between text-sm">
//                       <span>{item.description}</span>
//                       <span>{'$' + item.amount}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t pt-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>{'$100'}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>{'$25'}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Tax</span>
//                     <span>{'$50'}</span>
//                   </div>

//                   {/* Total */}
//                   <div className="flex justify-between font-medium text-lg border-t pt-2">
//                     <span>Total</span>
//                     <span>{'$175'}</span>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
