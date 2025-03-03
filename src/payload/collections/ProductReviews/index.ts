import { CollectionConfig } from 'payload'
import { PRODUCT_REVIEW_SLUG, CUSTOMER_SLUG, PRODUCT_SLUG, MEDIA_SLUG } from '../constants'

const ProductReviews: CollectionConfig = {
  slug: PRODUCT_REVIEW_SLUG,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Rating',
      min: 1,
      max: 10,
    },
    {
      name: 'review',
      type: 'textarea',
      required: true,
      label: 'Review',
    },
    {
      name: 'isVerifiedPurchase',
      type: 'checkbox',
      label: 'Verified Purchase',
      defaultValue: false,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: MEDIA_SLUG,
      hasMany: true,
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: CUSTOMER_SLUG,
      hasMany: false,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: PRODUCT_SLUG,
      hasMany: false,
    },
  ],
  timestamps: true,
} as const

export default ProductReviews
