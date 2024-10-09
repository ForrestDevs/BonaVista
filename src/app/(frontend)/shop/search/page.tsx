import { type Metadata } from 'next/types'
import { RedirectType, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
// import { ProductList } from '@/ui/products/productList'
// import { ProductNotFound } from '@/ui/products/ProductNotFound'

import { searchProducts } from '@/lib/search/search'
// import { ProductCard } from '@/components/shop/products/product-card'
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

  // const t = await getTranslations('/search.page')

  const products = await searchProducts(query)

  return (
    <div className="p-4 m-6 flex-1 space-y-6">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
        Search results for {query}
      </h1>
      <div>
        {products?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) =>
              typeof p === 'object' ? (
                <div key={p.id}>{p.title}</div>
              ) : null,
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* {products?.length ? <ProductList products={products} /> : <ProductNotFound query={query} />} */}
    </div>
  )
}
