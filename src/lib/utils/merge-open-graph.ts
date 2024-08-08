import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  siteName: 'BonaVista Leisurescapes',
  title: 'BonaVista Leisurescapes',
  description: 'Enhaning your outdoor living experience',
  images: [
    {
      url: `${process.env.PAYLOAD_URL}/images/favicon.ico`,
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
