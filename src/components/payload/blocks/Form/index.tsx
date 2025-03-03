'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { formSchema, interestedInOptions, type FormValues } from './formSchema'
import { submitForm } from './actions'
import RichText from '../../RichText'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'

type FormBlockProps = {
  preTitle?: string
  title: string
  body?: any // Rich text content
}

export const FormBlock: React.FC<FormBlockProps> = ({ preTitle, title, body }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      postalCode: '',
      interestedIn: '',
      message: '',
      subscribeToMailingList: true,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const result = await submitForm(values)
      if (result.success) {
        form.reset()
        toast.success('Form submitted successfully')
      } else {
        form.setError('root', { message: 'Failed to submit form' })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <section className="py-10">
      <div className="container flex flex-col items-center max-w-3xl gap-6 mx-auto">
        <div className="flex flex-col items-center text-center gap-2">
          {preTitle && (
            <p className="text-primary text-sm sm:text-base font-light uppercase tracking-wider">
              {preTitle}
            </p>
          )}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight text-gray-900">
            {title}
          </h2>
          <RichText content={body} className="p-0 m-0" />
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                id="contact-form"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 555-5555"
                            {...field}
                            autoComplete="tel"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="A1A 1A1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interestedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interested In</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select what you're interested in"
                              id="interested-in"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {interestedInOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us what you're looking for..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscribeToMailingList"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Subscribe to our mailing list for promotions and updates
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center pt-4">
                  <Button
                    type="submit"
                    className={cn(
                      'w-full transition-all duration-200',
                      'hover:translate-y-[-2px] hover:shadow-lg',
                    )}
                    disabled={form.formState.isSubmitting}
                    id="contact-form-submit"
                  >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
