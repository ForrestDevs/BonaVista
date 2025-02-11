
export const revalidate = 3600 // cache for 1 hour

function addLine(path: string) {
  return `<sitemap><loc>${process.env.NEXT_PUBLIC_URL}/${path}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`
}

export async function GET() {
  const xml = /* XML */ `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${addLine('sitemap.xml')}
    </sitemapindex>
  `

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
