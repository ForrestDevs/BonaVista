import { cn } from '@/lib/utils/cn'
import { Product } from '@payload-types'
import Link from 'next/link'

interface BreadcrumbPath {
  categories: {
    title: string
    slug: string
    fullSlug: string
  }[]
  isDefault: boolean
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function getAllCategoryPaths(product: Product): BreadcrumbPath[] {
  const paths: BreadcrumbPath[] = []

  // Convert each category's fullSlug into a path
  product.categories?.forEach((category) => {
    if (typeof category === 'number') return // Skip if it's just an ID

    const slugs = category.fullSlug?.split('/') || []

    // For the last category, use its actual title
    const categories = slugs.map((slug, index) => {
      const isLastCategory = index === slugs.length - 1
      return {
        title: isLastCategory ? category.title : formatSlugToTitle(slug),
        slug,
        fullSlug: slugs.slice(0, index + 1).join('/'),
      }
    })

    paths.push({
      categories,
      isDefault: false,
    })
  })

  // Mark the first path as default
  if (paths.length > 0) {
    paths[0].isDefault = true
  }

  return paths
}

export default function ProductBreadcrumb({
  product,
  searchParams,
}: {
  product: Product
  searchParams: { from?: string }
}) {
  const allPaths = getAllCategoryPaths(product)

  console.log(allPaths)

  // Get the category path from URL or use default
  let currentPath: BreadcrumbPath
  if (searchParams.from) {
    // Find matching path or fall back to default
    currentPath =
      allPaths.find((path) => path.categories.some((cat) => cat.fullSlug === searchParams.from)) ||
      allPaths.find((path) => path.isDefault)!
  } else {
    // Use default path
    currentPath = allPaths.find((path) => path.isDefault)!
  }

  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className="flex items-center whitespace-nowrap min-w-0 text-sm text-muted-foreground">
        <li className="flex items-center">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
        </li>
        {currentPath?.categories?.map((category, index) => (
          <li key={category.fullSlug} className="flex items-center">
            <span className="mx-2 text-muted-foreground/50">/</span>
            <Link
              href={`/shop/category/${category.fullSlug}`}
              className={cn(
                'hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-[200px]',
                index === currentPath?.categories?.length - 1 && 'font-medium text-foreground',
              )}
              title={category.title}
            >
              {category.title}
            </Link>
          </li>
        ))}
        <li className="flex items-center">
          <span className="mx-2 text-muted-foreground/50">/</span>
          <span
            className="font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]"
            title={product.title}
          >
            {product.title}
          </span>
        </li>
      </ol>
    </nav>
  )
}
