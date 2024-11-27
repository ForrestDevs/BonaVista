import { CollectionConfig } from 'payload'

const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'submissionType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Contact Form',
          value: 'contact',
        },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
    },
    {
      name: 'interestedIn',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'subscribeToMailingList',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
} as const

export default FormSubmissions
