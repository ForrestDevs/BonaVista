import type { Block } from 'payload'
import { CONTACT_FORM_BLOCK_SLUG } from '../constants'

export const ContactForm: Block = {
  slug: CONTACT_FORM_BLOCK_SLUG,
  imageAltText: 'FormBlock',
  imageURL: '/block-icons/form.png',
  fields: [
    {
      name: 'form',
      type: 'text',
      required: true,
    },
  ],
  interfaceName: 'ContactBlock',
}
