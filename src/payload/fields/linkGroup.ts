import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link'

import deepMerge from '../utilities/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
}) => Field


export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'link-groups',
    label: 'Link Group',
    type: 'array',
    fields: [
      link({
        appearances,
      }),
    ],
    admin: {
      
    }
  }

  return deepMerge(generatedLinkGroup, overrides)
}
