// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Checkbox } from "@components/ui/checkbox"
// type Category = {
//   slug: string
//   title: string
// }

// type CategoryFilterProps = {
//   categories: Category[]
// }
// export function CategoryOptions({ categories }: CategoryFilterProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])

//   useEffect(() => {
//     const currentCategories = searchParams.getAll('category')
//     if (currentCategories.length > 0) {
//       setSelectedCategories(currentCategories)
//     }
//   }, [searchParams])

//   const handleCategoryChange = (category: string, checked: boolean) => {
//     let newSelectedCategories: string[]
//     if (checked) {
//       if (selectedCategories.length === categories.length - 1) {
//         // If all categories are about to be selected, deselect them all instead
//         newSelectedCategories = []
//       } else {
//         newSelectedCategories = [...selectedCategories, category]
//       }
//     } else {
//       newSelectedCategories = selectedCategories.filter(c => c !== category)
//     }
//     setSelectedCategories(newSelectedCategories)

//     const newSearchParams = new URLSearchParams(searchParams.toString())
//     newSearchParams.delete('category')
//     newSelectedCategories.forEach(cat => newSearchParams.append('category', cat))

//     router.push(`?${newSearchParams.toString()}`)
//   }

//   return (
//     <div className="mb-4">
//       <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//         Filter by Category:
//       </label>
//       {categories.map((category) => (
//         <div key={category.slug} className="flex items-center mb-2">
//           <Checkbox
//             id={category.slug}
//             checked={selectedCategories.includes(category.slug)}
//             onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
//           />
//           <label
//             htmlFor={category.slug}
//             className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             {category.title}
//           </label>
//         </div>
//       ))}
//     </div>
//   )
// }
