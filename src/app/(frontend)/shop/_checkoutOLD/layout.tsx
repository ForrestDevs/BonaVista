// import { CheckoutProvider } from '@/app/(frontend)/shop/_checkoutOLD/context'
// import { getStoredCheckoutSession } from '@/lib/data/checkout'
// import { Metadata } from 'next'
// import { redirect } from 'next/navigation'

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: 'Checkout',
//   }
// }

// type CheckoutLayoutProps = {
//   children: React.ReactNode
// }

// export default async function CheckoutLayout({ children }: CheckoutLayoutProps) {
//   const checkoutSession = await getStoredCheckoutSession()

//   if (!checkoutSession) {
//     console.error('Failed to retrieve checkout session')
//     redirect('/shop/cart')
//   }

//   return <CheckoutProvider checkoutSession={checkoutSession}>{children}</CheckoutProvider>
// }
