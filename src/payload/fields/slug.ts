import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'
import formatSlug from '../utilities/formatSlug'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      required: false, // Need to be false so that we can use beforeValidate hook to set slug.
      admin: {
        position: 'sidebar',
        description: 'Auto generated field ',
        condition: data => {
          return !data?.isHome
        },
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
