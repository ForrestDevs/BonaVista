// import { Loader2 } from 'lucide-react'
// import { redirect } from 'next/navigation'
// import { Suspense } from 'react'
// import { getOrder } from '@/lib/data/order'

// export default async function OrderSuccessPage({
//   searchParams,
// }: {
//   searchParams: { payment_intent?: string; order_id?: string }
// }) {
//   if (!searchParams.payment_intent || !searchParams.order_id) {
//     redirect('/shop')
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-2xl text-center">
//           <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//             Thank you for your order!
//           </h1>
//           <p className="mt-6 text-lg leading-8 text-gray-600">
//             Your payment was successful. You will be redirected to your order details in a moment.
//           </p>
//           <div className="mt-10 flex items-center justify-center gap-x-6">
//             <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
//           </div>
//         </div>
//       </div>
//       <Suspense>
//         <OrderStatusCheck 
//           paymentIntentId={searchParams.payment_intent} 
//           orderId={searchParams.order_id} 
//         />
//       </Suspense>
//     </div>
//   )
// }

// async function OrderStatusCheck({ paymentIntentId, orderId }: { paymentIntentId: string, orderId: string }) {
//   const order = await getOrder(orderId)
  
//   if (order?.status === 'paid') {
//     redirect(`/shop/order/${orderId}`)
//   }
  
//   return null
// } 