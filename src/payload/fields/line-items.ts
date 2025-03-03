import deepMerge from '@/lib/utils/deepMerge'
import type { Field } from 'payload'

type LineItemType = () => Field
type LineItemsType = (options?: { overrides?: Record<string, unknown> }) => Field

const lineItem: LineItemType = () => {
  const lineItemResult: Field = {
    name: 'lineItem',
    interfaceName: 'LineItem',
    type: 'group',
    fields: [
      {
        name: 'product',
        type: 'relationship',
        relationTo: 'products',
        hasMany: false,
        required: true,
      },
      {
        name: 'isVariant',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'variantOptions',
        type: 'array',
        fields: [
          {
            name: 'key',
            type: 'group',
            fields: [
              {
                name: 'slug',
                type: 'text',
              },
              {
                name: 'label',
                type: 'text',
              },
            ],
          },
          {
            name: 'value',
            type: 'group',
            fields: [
              {
                name: 'slug',
                type: 'text',
              },
              {
                name: 'label',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'sku',
        type: 'text',
        label: 'SKU',
        required: true,
      },
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        required: true,
        min: 0,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
        min: 0,
        admin: {
          step: 1,
        },
      },
      {
        name: 'thumbnail',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'url',
        type: 'text',
      },
    ],
  }

  return lineItemResult
}

export const lineItems: LineItemsType = ({ overrides = {} } = {}) => {
  const lineItemsResult: Field = {
    name: 'lineItems',
    label: 'Line Items',
    type: 'array',
    interfaceName: 'LineItems',
    fields: [lineItem()],
  }

  return deepMerge(lineItemsResult, overrides)
}
