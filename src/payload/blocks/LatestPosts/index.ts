import type { Block } from 'payload'
import { link } from '../../fields/link'

export const LatestPosts: Block = {
  slug: 'latest-posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body',
    },
    link(),
  ],
  interfaceName: 'LatestPostsBlock',
}
