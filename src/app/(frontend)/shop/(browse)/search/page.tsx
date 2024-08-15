import { type Metadata } from 'next/types'
import { RedirectType, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
// import { ProductList } from '@/ui/products/productList'
// import { ProductNotFound } from '@/ui/products/ProductNotFound'

import { searchProducts } from '@/lib/search/search'
// import { publicUrl } from '@/env.mjs'

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: {
    q?: string
  }
}): Promise<Metadata> => {
  const t = await getTranslations('/search.metadata')
  return {
    title: t('title', { query: searchParams.q }),
    alternates: { canonical: `${process.env.NEXT_PUBLIC_URL}/store/search` },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string
  }
}) {
  const query = searchParams.q

  if (!query) {
    return redirect('/store', RedirectType.replace)
  }

  const t = await getTranslations('/search.page')

  const products = await searchProducts(query)

  return (
    <main>
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        {t('title', { query })}
      </h1>
      <div>
        {products?.length ? (
          <>
            {products.map((p) =>
              typeof p === 'object' ? (
                <div key={p.id}>
                  {p.title}
                  {p.categories?.map((c) => c.toString()).join(', ')}
                  {p.priceJSON}
                  {/* {p.tags?.map((t) => t.toString()).join(', ')} */}
                  {/* {p.description}
                  {p.price}
                  {p.thumbnail} */}
                </div>
              ) : null,
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {/* {products?.length ? <ProductList products={products} /> : <ProductNotFound query={query} />} */}
    </main>
  )
}
