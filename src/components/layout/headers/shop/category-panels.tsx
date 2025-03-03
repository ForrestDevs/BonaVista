'use client'

import { useState } from 'react'
import { ProductCategory } from '@payload-types'
import { categoryPanelClass } from '@/components/custom/shop-nav'
import { cn } from '@/lib/utils/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface CategoryPanelProps {
  categories: ProductCategory[]
  title: string
  onHover?: (category: ProductCategory) => void
  activeId?: number
  hasChildren?: (id: number) => boolean
}

const CategoryPanel = ({
  categories,
  title,
  onHover,
  activeId,
  hasChildren = () => false,
}: CategoryPanelProps) => {
  if (!categories?.length) return null

  return (
    <div
      className={cn(
        categoryPanelClass(),
        'w-[250px] shrink-0',
        'border-r border-gray-100/50 last:border-r-0',
        'transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
      )}
    >
      <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100/50">
        {title}
      </div>
      <ul className="py-2">
        {categories.map((category) => (
          <li key={category.id} className="relative" onMouseEnter={() => onHover?.(category)}>
            <div
              className={cn(
                'group px-4 py-2 text-sm transition-all duration-200',
                'flex items-center justify-between',
                'hover:bg-gray-50/80 rounded-sm',
                'hover:pl-5',
                activeId === category.id && 'bg-gray-50/80 pl-5 rounded-sm',
              )}
            >
              <Link
                href={`/shop/category/${category.fullSlug}`}
                className={cn(
                  'flex-1 text-gray-900',
                  'underline-offset-4 hover:underline',
                  'transition-colors duration-200',
                )}
              >
                {category.title}
              </Link>
              {hasChildren(category.id) && (
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-gray-400 ml-2',
                    'transition-all duration-200',
                    'group-hover:translate-x-0.5 group-hover:text-gray-600',
                  )}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface CategoryPanelsProps {
  rootCategories: ProductCategory[]
  initialCategoryMap: Record<number, ProductCategory & { children: ProductCategory[] }>
}

export function CategoryPanels({ rootCategories, initialCategoryMap }: CategoryPanelsProps) {
  const [activeL1, setActiveL1] = useState<ProductCategory | null>(null)
  const [activeL2, setActiveL2] = useState<ProductCategory | null>(null)

  const handleL1Hover = (category: ProductCategory) => {
    if (category.id === activeL1?.id) return
    setActiveL1(category)
    setActiveL2(null)
  }

  const handleL2Hover = (category: ProductCategory) => {
    if (category.id === activeL2?.id) return
    setActiveL2(category)
  }

  const hasChildren = (id: number) => {
    return initialCategoryMap[id]?.children?.length > 0
  }

  const l2Categories = activeL1 ? initialCategoryMap[activeL1.id]?.children || [] : []
  const l3Categories = activeL2 ? initialCategoryMap[activeL2.id]?.children || [] : []

  const hasL2 = l2Categories.length > 0
  const hasL3 = l3Categories.length > 0

  // Calculate panel state
  const panelState = !activeL1 ? 'l1-only' : !hasL2 ? 'l1-only' : !activeL2 || !hasL3 ? 'l2' : 'l3'

  // Set panel state on the parent container
  React.useEffect(() => {
    const container = document.querySelector('.category-nav-content')
    if (container) {
      container.setAttribute('data-panel-state', panelState)
    }
  }, [panelState])

  return (
    <div
      className={cn(
        'w-full p-2',
        'flex relative',
        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
      )}
      data-state={panelState}
      onMouseLeave={() => {
        setActiveL1(null)
        setActiveL2(null)
      }}
    >
      {/* First Level - Root Categories */}
      <div className="flex-none">
        <CategoryPanel
          categories={rootCategories}
          title="Main Categories"
          onHover={handleL1Hover}
          activeId={activeL1?.id}
          hasChildren={hasChildren}
        />
      </div>

      {/* Second Level */}
      <div
        className={cn(
          'flex-none overflow-hidden',
          'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          !activeL1 || !hasL2 ? 'w-0 opacity-0' : 'w-[250px] opacity-100',
        )}
      >
        <CategoryPanel
          categories={l2Categories}
          title={activeL1?.title ?? ''}
          onHover={handleL2Hover}
          activeId={activeL2?.id}
          hasChildren={hasChildren}
        />
      </div>

      {/* Third Level */}
      <div
        className={cn(
          'flex-none overflow-hidden',
          'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          !activeL2 || !hasL3 ? 'w-0 opacity-0' : 'w-[250px] opacity-100',
        )}
      >
        <CategoryPanel
          categories={l3Categories}
          title={activeL2?.title ?? ''}
          hasChildren={hasChildren}
        />
      </div>
    </div>
  )
}
