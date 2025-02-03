import { Plugin } from 'payload'
import { Page, Post } from '@/payload-types'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { getServerSideURL } from '@/lib/utils/getURL'

import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { revalidateRedirects } from '../hooks/revalidateRedirects'
import { s3Storage } from '@payloadcms/storage-s3'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['pages', 'media-folders'],
    generateLabel: (_, doc) => doc.title as string,
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  s3Storage({
    collections: {
      ['media']: true,
    },
    bucket: process.env.S3_BUCKET || 'media',
    config: {
      endpoint: process.env.S3_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
    },
  }),
  // stripePlugin({
  //   stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  //   stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
  //   isTestKey: Boolean(process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY),
  //   rest: false,
  //   webhooks: {
  //     'price.updated': priceUpdated,
  //     'product.created': productUpdated,
  //     'product.updated': productUpdated,
  //   },
  // }),

  // payloadAiPlugin({
  //   generatePromptOnInit: true,
  //   collections: {
  //     ["posts"]: true,
  //     ["pages"]: true,
  //   },
  //   debugging: true,
  // }),
]
