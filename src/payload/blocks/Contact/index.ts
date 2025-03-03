import type { Block } from 'payload'

export const Contact: Block = {
  slug: 'contact',
  imageAltText: 'ContactInfoBlock',
  imageURL: '/block-icons/contact-info.png',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact Info',
    plural: 'Contact Infos',
  },
}
