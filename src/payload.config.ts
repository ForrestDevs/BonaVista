import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import {
  UnderlineFeature,
  IndentFeature,
  AlignFeature,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import Users from './payload/collections/Users'
import globals from './payload/globals'
import collections from './payload/collections'
import { plugins } from './payload/plugins'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

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
  email: nodemailerAdapter({
    defaultFromAddress: 'donotreply@bonavistaleisurescapes.com',
    defaultFromName: 'Bonavista Leisurescapes',
    transport: nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'admin@bonavistaleisurescapes.com',
        pass: 'vzdkgktbgvwhtvrk',
      },
    }),
  }),
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'lib/migrations'),
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
  secret: process.env.PAYLOAD_SECRET || 'a10c2070-903e-4297-918d-b6917b92eb36',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  ...(process.env.NODE_ENV === 'development' && {
    onInit: async (payload) => {
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
            name: 'Admin',
            email: 'admin@bonavistaleisurescapes.com',
            password: 'devs',
            roles: ['admin'],
          },
        })
      }
    },
  }),
})
