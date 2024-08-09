import { PricedProduct } from '@medusajs/medusa/dist/types/pricing'
import Link from 'next/link'

type ProductInfoProps = {
  product: PricedProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <Link
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </Link>
        )}
        <h2 className="text-3xl leading-10 text-ui-fg-base" data-testid="product-title">
          {product.title}
        </h2>

        <p className="text-medium text-ui-fg-subtle" data-testid="product-description">
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
