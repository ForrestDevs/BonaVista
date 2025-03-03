import deepMerge from '@/lib/utils/deepMerge'
import { Field } from 'payload'

type AddressType = (options?: { overrides?: Record<string, unknown> }) => Field

export const address: AddressType = ({ overrides = {} } = {}) => {
  const addressResult: Field = {
    name: 'address',
    type: 'group',
    interfaceName: 'Address',
    fields: [
      {
        name: 'first_name',
        type: 'text',
        required: false,
        label: 'First Name',
      },
      {
        name: 'last_name',
        type: 'text',
        required: false,
        label: 'Last Name',
      },
      {
        name: 'company',
        type: 'text',
        required: false,
        label: 'Company',
      },
      {
        name: 'line_1',
        type: 'text',
        required: true,
        label: 'Address Line 1',
      },
      {
        name: 'line_2',
        type: 'text',
        required: false,
        label: 'Address Line 2',
      },
      {
        name: 'city',
        type: 'text',
        required: true,
        label: 'City',
      },
      {
        name: 'country',
        type: 'text',
        required: true,
        label: 'Country Code',
      },
      {
        name: 'state',
        type: 'text',
        required: true,
        label: 'State/Province',
      },
      {
        name: 'postal_code',
        type: 'text',
        required: true,
        label: 'Postal Code',
      },
      {
        name: 'phone',
        type: 'text',
        required: true,
        label: 'Phone',
      },
      {
        name: 'email',
        type: 'text',
        required: true,
        label: 'Email',
      },
      {
        name: 'metadata',
        type: 'json',
        label: 'Metadata',
      },
    ],
  }

  return deepMerge(addressResult, overrides)
}
