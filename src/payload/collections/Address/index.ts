import { CollectionConfig } from 'payload'
import { ADDRESS_SLUG, CUSTOMER_SLUG } from '../constants'

const Address: CollectionConfig = {
  slug: ADDRESS_SLUG,
  admin: {
    group: 'Shop',
    useAsTitle: 'address_1',
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      required: true,
      label: 'Customer',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Company',
    },
    {
      name: 'first_name',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'address_1',
      type: 'text',
      required: true,
      label: 'Address Line 1',
    },
    {
      name: 'address_2',
      type: 'text',
      required: true,
      label: 'Address Line 2',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'City',
    },
    {
      name: 'country_code',
      type: 'text',
      required: true,
      label: 'Country Code',
    },
    {
      name: 'province',
      type: 'text',
      required: true,
      label: 'Province',
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
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
    },
  ],
} as const

export default Address
