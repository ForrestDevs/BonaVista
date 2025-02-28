'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { verifyOrderAction } from '@/lib/actions/order'
import { toast } from 'sonner'

const orderVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  orderNumber: z.string(),
})

type OrderVerificationFormValues = z.infer<typeof orderVerificationSchema>

export default function OrderVerificationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<OrderVerificationFormValues>({
    resolver: zodResolver(orderVerificationSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: OrderVerificationFormValues) {
    setLoading(true)
    try {
      const result = await verifyOrderAction(values.email, parseInt(values.orderNumber))
      if (result.success) {
        router.push(`/shop/orders?verified=${result.verificationToken}`)
        router.refresh()
      } else {
        toast.error('Order verification failed', {
          description: result.error || 'Please check your email and order number',
        })
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Verify Your Order</h1>
              <p className="text-gray-500 mt-2">
                Please enter your email address and order number to view your order details.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormDescription>The email address used for this order</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your order number" {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        The order number from your confirmation email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Order'}
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </main>
  )
}
