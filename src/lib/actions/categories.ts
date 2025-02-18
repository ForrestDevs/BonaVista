'use server'

import { getCachedCategoriesByParentId } from '@/lib/utils/getCategories'
import { ProductCategory } from '@payload-types'
import { cache } from 'react'

// Cache the entire category tree for the session
export const getCategoryTree = cache(async () => {
  try {
    // Get root categories
    const rootCategories = await getCachedCategoriesByParentId(null)
    
    // Create a map to store all categories by their ID
    const categoryMap: Record<number, ProductCategory & { children: ProductCategory[] }> = {}
    
    // Initialize root categories in the map
    rootCategories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] }
    })
    
    // Fetch children for all non-leaf categories in parallel
    await Promise.all(
      rootCategories.map(async (category) => {
        if (category.isLeaf) return
        
        const children = await getCachedCategoriesByParentId(category.id)
        categoryMap[category.id].children = children
        
        // Add children to the map
        children.forEach(child => {
          categoryMap[child.id] = { ...child, children: [] }
        })
        
        // Fetch grandchildren for non-leaf children
        await Promise.all(
          children.filter(child => !child.isLeaf).map(async (child) => {
            const grandchildren = await getCachedCategoriesByParentId(child.id)
            categoryMap[child.id].children = grandchildren
            
            // Add grandchildren to the map
            grandchildren.forEach(grandchild => {
              categoryMap[grandchild.id] = { ...grandchild, children: [] }
            })
          })
        )
      })
    )
    
    return {
      rootCategories,
      categoryMap
    }
  } catch (error) {
    console.error('Failed to fetch category tree:', error)
    return {
      rootCategories: [],
      categoryMap: {}
    }
  }
})

// Helper to get children for a specific category from the cached tree
export async function getCategoryChildren(parentId: number) {
  const { categoryMap } = await getCategoryTree()
  return categoryMap[parentId]?.children || []
}

export async function getChildCategories(parentId: number): Promise<ProductCategory[]> {
  try {
    const categories = await getCachedCategoriesByParentId(parentId)
    return categories
  } catch (error) {
    console.error('Failed to fetch child categories:', error)
    return []
  }
}

export async function prefetchCategoryChildren(categories: ProductCategory[]): Promise<Record<number, ProductCategory[]>> {
  try {
    const childrenMap: Record<number, ProductCategory[]> = {}
    
    // Fetch all children in parallel
    const results = await Promise.all(
      categories.map(async (category) => {
        if (category.isLeaf) return null
        const children = await getCachedCategoriesByParentId(category.id)
        return { parentId: category.id, children }
      })
    )

    // Build the map of parent -> children
    results.forEach((result) => {
      if (result) {
        childrenMap[result.parentId] = result.children
      }
    })

    return childrenMap
  } catch (error) {
    console.error('Failed to prefetch category children:', error)
    return {}
  }
} 