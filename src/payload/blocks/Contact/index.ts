import type { Block } from 'payload'

export const Contact: Block = {
  slug: 'contact',
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
}
