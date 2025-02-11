import type { CollectionConfig } from 'payload'
import { anyone, admins } from '@payload/access'
import { SPA_SLUG } from '../constants'
import { slugField } from '@/payload/fields/slug'
import { MetaTitleField, OverviewField } from '@payloadcms/plugin-seo/fields'
import { MetaImageField } from '@payloadcms/plugin-seo/fields'
import { MetaDescriptionField } from '@payloadcms/plugin-seo/fields'
import { PreviewField } from '@payloadcms/plugin-seo/fields'
import { revalidateSpa } from './hooks/revalidateSpa'

export const Spas: CollectionConfig = {
  slug: SPA_SLUG,
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  fields: [
    ...slugField(),
    {
      type: 'tabs',
      tabs: [
        // Info
        {
          label: 'Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: 'Hot Tub', value: 'hot-tub' },
                    { label: 'Swim Spa', value: 'swim-spa' },
                  ],
                  required: true,
                },
                {
                  name: 'hotTubCollection',
                  type: 'select',
                  options: [
                    { label: 'Self-Cleaning', value: 'self-cleaning' },
                    { label: 'Serenity', value: 'serenity' },
                  ],
                  admin: {
                    condition: (_, { type } = {}) => ['hot-tub'].includes(type),
                  },
                },
                {
                  name: 'swimSpaCollection',
                  type: 'select',
                  options: [
                    { label: 'Executive Trainer', value: 'executive-trainer' },
                    { label: 'Executive Sport', value: 'executive-sport' },
                    { label: 'Aqua Trainer', value: 'aqua-trainer' },
                    { label: 'Aqua Sport', value: 'aqua-sport' },
                    { label: 'Aqua Play', value: 'aqua-play' },
                  ],
                  admin: {
                    condition: (_, { type } = {}) => ['swim-spa'].includes(type),
                  },
                },
              ],
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Title',
            },
            {
              name: 'startingPrice',
              type: 'number',
              label: 'Starting From Price',
            },
            {
              name: 'modelYear',
              type: 'number',
              label: 'Model Year',
            },
            {
              name: 'model',
              type: 'text',
              label: 'Model',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        // Specs
        {
          label: 'Specs',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'seatingDesign',
                  type: 'text',
                  label: 'Seating Design',
                },
                {
                  name: 'seating',
                  type: 'text',
                  label: 'Seating',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'jets',
                  type: 'text',
                },
                {
                  name: 'volume',
                  type: 'text',
                  label: 'Volume',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'swimSystem',
                  type: 'text',
                  label: 'Swim System',
                },
                {
                  name: 'sizeCategory',
                  type: 'text',
                  label: 'Size Category',
                },
              ],
              admin: {
                condition: (siblingData) => siblingData?.type === 'swim-spa',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'energyEfficiency',
                  type: 'number',
                  label: 'Energy Efficiency',
                },
                {
                  name: 'hydroGuide',
                  type: 'text',
                  label: 'Hydro Guide',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'dimensions',
                  type: 'text',
                  label: 'Dimensions',
                },
                {
                  name: 'height',
                  type: 'text',
                  label: 'Height',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'weightFull',
                  type: 'text',
                  label: 'Weight When Full',
                },
                {
                  name: 'weightEmpty',
                  type: 'text',
                  label: 'Weight When Empty',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'swimArea',
                  type: 'text',
                  label: 'Swim Area',
                },
                {
                  name: 'jetPumps',
                  type: 'text',
                  label: 'Jet Pumps',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'interiorLighting',
                  type: 'text',
                  label: 'Interior Lighting',
                },
                {
                  name: 'exteriorLighting',
                  type: 'text',
                  label: 'Exterior Lighting',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'waterFalls',
                  type: 'text',
                  label: 'Water Falls',
                },
                {
                  name: 'selfCleaning',
                  type: 'checkbox',
                  label: 'Self Cleaning',
                },
                {
                  name: 'circulationPump',
                  type: 'checkbox',
                  label: 'Circulation Pump',
                },
                {
                  name: 'automatedWellness',
                  type: 'checkbox',
                  label: 'Automated Wellness',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pureWaterSystem',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Standard', value: 'standard' },
                  ],
                  defaultValue: 'optional',
                  label: 'Pure Water System',
                },
                {
                  name: 'ezZonePure',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Standard', value: 'standard' },
                  ],
                  defaultValue: 'optional',
                  label: 'EZ Zone Pure',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'oasisPackage',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Not Available', value: 'not-available' },
                  ],
                  defaultValue: 'optional',
                  label: 'Oasis Package',
                },
                {
                  name: 'hydroFlex',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Not Available', value: 'not-available' },
                  ],
                  defaultValue: 'optional',
                  label: 'HydroFlex',
                },
                {
                  name: 'iCommand',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Not Available', value: 'not-available' },
                  ],
                  defaultValue: 'optional',
                  label: 'iCommand',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'northernFalls',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Not Available', value: 'not-available' },
                  ],
                  defaultValue: 'optional',
                  label: 'Northern Falls',
                },
                {
                  name: 'chromatherapy',
                  type: 'select',
                  options: [
                    { label: 'Optional', value: 'optional' },
                    { label: 'Not Available', value: 'not-available' },
                  ],
                  defaultValue: 'optional',
                  label: 'Chromatherapy',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heater',
                  type: 'text',
                  label: 'Heater',
                },
                {
                  name: 'electrical',
                  type: 'text',
                  label: 'Electrical',
                },
                {
                  name: 'warranty',
                  type: 'text',
                  label: 'Warranty',
                },
              ],
            },
          ],
        },
        // Meta
        {
          label: 'Meta',
          fields: [
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              // required: true,
            },
            {
              name: 'topdown',
              type: 'upload',
              relationTo: 'media',
              // required: true,
            },
            {
              name: 'threeDModel',
              type: 'text',
              label: '3D Model',
            },
            {
              name: 'detailsLink',
              type: 'text',
              label: 'Link to More Details',
            },
            {
              name: 'quoteLink',
              type: 'text',
              label: 'Link to Get a Quote',
            },
            {
              name: 'financingLink',
              type: 'text',
              label: 'Link to Apply for Financing',
            },
          ],
        },
        // SEO
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({
              hasGenerateFn: true,
              overrides: {
                maxLength: 250,
              },
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSpa],
  },
} as const

export default Spas
