'use server'

import { FormValues } from './formSchema'
import getPayload from '@/lib/utils/getPayload'

export async function submitForm(values: FormValues) {
  try {
    const payload = await getPayload()
    
    // Create form submission in Payload
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        submissionType: 'contact',
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        postalCode: values.postalCode,
        interestedIn: values.interestedIn.map(value => ({ value })),
        message: values.message,
        subscribeToMailingList: values.subscribeToMailingList,
      },
    })

    // If user opted in to mailing list, add them to your email service
    if (values.subscribeToMailingList) {
      // Add logic to subscribe to mailing list
      // Example: await subscribeToMailingList(values.email)
    }

    return { success: true, data: submission }
  } catch (error) {
    console.error('Form submission error:', error)
    return { success: false, error: 'Failed to submit form' }
  }
} 