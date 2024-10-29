import React, { Suspense } from 'react'
import type { Metadata } from 'next/types'
import BlogFilters from '@/components/marketing/blog/filter'
import FilteredPagination from '@/components/marketing/blog/pagination'
import getPayload from '@/lib/utils/getPayload'
import { blogFiltersCache } from '@/components/marketing/blog/searchParams'

// export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function Page({ searchParams }: Args) {
  const searchParams_ = await searchParams
  const { category, page } = blogFiltersCache.parse(searchParams_)
  const payload = await getPayload()

  const categories = await payload.find({
    collection: 'blog-categories',
    depth: 0,
    where: {
      showInFilter: {
        equals: true,
      },
    },
  })

  const categoryId = categories.docs?.find((result) => result.slug === category)?.id

  return (
    <div className="flex flex-col min-h-screen space-y-16">
      <HeroSmall />
      <BlogIntro />
      <BlogFilters categories={categories.docs} />
      <FilteredPagination category={categoryId} page={page} />
    </div>
  )
}

function BlogIntro() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-lg font-light uppercase tracking-wider mb-3">
            Dive into Our World
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore the Latest in Hot Tub Lifestyle
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Welcome to our blog, where we share expert insights, maintenance tips, and inspiring
            stories about the joys of hot tub ownership. Whether you're a seasoned enthusiast or
            just starting your journey, there's something here for everyone.
          </p>
        </div>
      </div>
    </section>
  )
}

function HeroSmall() {
  return (
    <section
      className="relative min-h-[400px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Avera.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Blog</h1>
        <p className="text-lg md:text-xl font-light uppercase tracking-widest">
          Latest news and insights
        </p>
      </div>
    </section>
  )
}

// export function generateMetadata(): Metadata {
//   return {
//     title: `Payload Website Template Posts`,
//   }
// }

// {/* <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Blog post 1 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
//                 <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 15, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 2 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
//                 <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 10, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 3 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
//                 <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 5, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//              {/* Blog post 1 */}
//              <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
//                 <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 15, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 2 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
//                 <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 10, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 3 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
//                 <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 5, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//              {/* Blog post 1 */}
//              <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
//                 <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 15, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 2 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
//                 <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 10, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 3 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
//                 <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 5, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//              {/* Blog post 1 */}
//              <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
//                 <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 15, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 2 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
//                 <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 10, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 3 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
//                 <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 5, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//              {/* Blog post 1 */}
//              <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
//                 <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 15, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 2 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
//                 <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 10, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Blog post 3 */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
//                 <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">June 5, 2023</span>
//                   <a href="#" className="text-blue-600 hover:underline">Read More</a>
//                 </div>
//               </div>
//             </div>

//             {/* Add more blog posts as needed */}
//           </div>
//         </div>
//       </section> */}
