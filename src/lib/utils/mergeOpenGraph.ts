import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  siteName: 'BonaVista Leisurescapes',
  title: 'BonaVista Leisurescapes',
  description: 'Enhaning your outdoor living experience',
  images: [
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/LogoWhiteBG.jpg`
        : '/LogoWhiteBG.jpg',
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
