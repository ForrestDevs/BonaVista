import { PRODUCT_CATEGORY_SLUG } from '../../constants'

export async function getCategoryBreadcrumbs(
  req: any,
  categoryId: string,
): Promise<{ name: string; slug: string; fullSlug: string }[]> {
  const breadcrumbs = []
  let current = await req.payload.findByID({
    collection: PRODUCT_CATEGORY_SLUG,
    id: categoryId,
  })

  while (current) {
    breadcrumbs.unshift({
      name: current.name,
      slug: current.slug,
      fullSlug: current.fullSlug,
    })
    if (!current.parent) break
    const parentId = typeof current.parent === 'object' ? current.parent.id : current.parent
    current = await req.payload.findByID({
      collection: PRODUCT_CATEGORY_SLUG,
      id: parentId,
    })
  }

  return breadcrumbs
}
