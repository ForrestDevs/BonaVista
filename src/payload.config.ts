import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  UnderlineFeature,
  IndentFeature,
  AlignFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import Users from './payload/collections/Users'
import globals from './payload/globals'
import collections from './payload/collections'
import { plugins } from './payload/plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
const allowedOrigins = [
  serverURL,
  'https://www2.bonavistaleisurescapes.com',
  'https://bonavistaleisurescapes.com',
].filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: lexicalEditor({
    features: () => {
      return [
        // PayloadAiPluginLexicalEditorFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        AlignFeature(),
        IndentFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    transactionOptions: false,
  }),
  collections,
  globals,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  endpoints: [
    // {
    //   handler: createPaymentIntent,
    //   method: 'post',
    //   path: '/create-payment-intent',
    // },
    // {
    //   handler: customersProxy,
    //   method: 'get',
    //   path: '/stripe/customers',
    // },
    // {
    //   handler: productsProxy,
    //   method: 'get',
    //   path: '/stripe/products',
    // },
    // {
    //   handler: pricesProxy,
    //   method: 'get',
    //   path: '/stripe/prices',
    // },
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    // {
    //   handler: seed,
    //   method: 'get',
    //   path: '/seed',
    // },
  ],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET || 'default',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    // This is useful for local development
    // so you do not need to create a first-user every time
    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          name: 'Dev User',
          email: 'dev@payloadcms.com',
          password: 'test',
          roles: ['admin'],
        },
      })
    }
  },
})
