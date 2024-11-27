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
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'subscribeToMailingList',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        readOnly: true,
      },
    },
  ],
} as const

export default FormSubmissions
