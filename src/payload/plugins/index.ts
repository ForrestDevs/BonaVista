import { Plugin } from 'payload'
import { Page, Post, Spa } from '@/payload-types'
import {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import { getServerSideURL } from '@/lib/utils/getURL'

import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { revalidateRedirects } from '../hooks/revalidateRedirects'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const generateDescription: GenerateDescription<Spa> = ({ doc }) => {
  return (
    doc.description +
      ` Experience the ultimate in luxury hydrotherapy and wellness with BonaVista Leisurescapes, Toronto's premier Hydropool dealer.` ||
    'BonaVista Leisurescapes'
  )
}

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title
    ? `${doc.title} | BonaVista Leisurescapes`
    : 'BonaVista Leisurescapes'
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
    generateDescription,
  }),
  vercelBlobStorage({
    collections: {
      ['media']: {
        prefix: 'bonavista/',
      },
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
]
