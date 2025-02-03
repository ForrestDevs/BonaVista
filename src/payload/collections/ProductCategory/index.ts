import type { CollectionConfig } from 'payload'
import { admin } from '@payload/access'
import { PRODUCT_CATEGORY_SLUG, PRODUCT_SLUG } from '@payload/collections/constants'
import { slugField } from '@payload/fields/slug'
import { beforeDelete } from './hooks/beforeDelete'
import { beforeChange } from './hooks/beforeChange'
import { afterChange } from './hooks/afterChange'
import getDescendants from './utils/getDescendants'

const ProductCategory: CollectionConfig = {
  slug: PRODUCT_CATEGORY_SLUG,
  access: {
    create: admin,
    read: () => true,
    update: admin,
    delete: admin,
  },
  admin: {
    group: 'Shop',
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'fullSlug', 'isLeaf'],
  },
  hooks: {
    beforeDelete: [beforeDelete],
    beforeChange: [beforeChange],
    afterChange: [afterChange],
  },
  fields: [
    ...slugField(),
    {
      name: 'fullSlug',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description:
          'The full URL path for this category, computed from the parent chain (e.g.: electronics/cameras/dslr).',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: PRODUCT_CATEGORY_SLUG,
      hasMany: false,
      admin: {
        description: 'Select a parent category (leave empty for root categories)',
        position: 'sidebar',
      },
      validate: async (value, { id, req }) => {
        // If no parent is selected, this is a root category.
        if (!value) return true

        const parentId = typeof value === 'object' ? value.value : value
        if (parentId === id) return 'A category cannot be its own parent.'

        // Walk upward to ensure there are no circular references.
        let currentParent = await req.payload.findByID({
          collection: PRODUCT_CATEGORY_SLUG,
          id: parentId,
        })

        const traversedIds = new Set([id])
        while (currentParent?.parent) {
          const ancestorId =
            typeof currentParent.parent === 'object'
              ? currentParent.parent.id
              : currentParent.parent
          if (traversedIds.has(ancestorId)) {
            return 'Circular reference detected in category hierarchy.'
          }
          traversedIds.add(ancestorId)
          currentParent = await req.payload.findByID({
            collection: PRODUCT_CATEGORY_SLUG,
            id: ancestorId,
          })
        }

        return true
      },
      filterOptions: async ({ id, req }) => {
        // Initialize empty filter object
        const filter: Record<string, any> = {}

        // For new categories (id is undefined), we only need to ensure
        // they can't select categories that are already children of others
        if (!id) {
          return filter
        }

        // For existing categories, prevent self-selection and descendants
        try {
          // Base filter to prevent self-selection and descendants
          filter.and = [{ id: { not_equals: id } }]

          // Get all descendants to prevent circular references
          const descendants = await getDescendants(req, id)
          if (descendants.length > 0) {
            filter.and.push({
              id: { not_in: descendants.map((desc) => desc.id) },
            })
          }
        } catch (error) {
          // Ensure at minimum we prevent self-selection
          return { id: { not_equals: id } }
        }
        return filter
      },
    },
    {
      name: 'isLeaf',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Indicates if the category is a leaf (i.e. has no children). Products can only be assigned to leaf categories.',
        readOnly: true,
        position: 'sidebar',
      },
    },
    // used as debug field to see the children of a category
    {
      name: 'children',
      type: 'join',
      collection: PRODUCT_CATEGORY_SLUG,
      on: 'parent',
      label: 'Children',
      admin: {
        position: 'sidebar',
        allowCreate: false,
        defaultColumns: ['title'],
      },
    },
    // used as debug field to see the products assigned to a category
    {
      name: 'products',
      type: 'join',
      collection: PRODUCT_SLUG,
      on: 'categories',
      label: 'Products',
      admin: {
        position: 'sidebar',
        allowCreate: false,
        defaultColumns: ['title'],
      },
    },
  ],
  timestamps: true,
} as const

export default ProductCategory
