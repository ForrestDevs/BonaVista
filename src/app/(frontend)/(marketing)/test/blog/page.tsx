import React from 'react'

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative min-h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/Avera.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg md:text-xl font-light uppercase tracking-widest">Latest news and insights</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto px-4 text-center flex flex-col items-center space-y-6">
          <p className="text-blue-600 font-light uppercase tracking-widest">Stay Informed</p>
          <h2 className="text-4xl font-bold">Welcome to Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends, tips, and insights about hot tubs, spas, and wellness. Our blog is your go-to resource for everything related to relaxation and luxury living.
          </p>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="hidden md:flex justify-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
                All Posts
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                Hot Tub Care
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                Wellness Tips
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                Product Reviews
              </button>
            </div>
            <div className="md:hidden">
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>All Posts</option>
                <option>Hot Tub Care</option>
                <option>Wellness Tips</option>
                <option>Product Reviews</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog post 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
                <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 15, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
                <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 10, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
                <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 5, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

             {/* Blog post 1 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
                <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 15, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
                <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 10, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
                <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 5, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

             {/* Blog post 1 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
                <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 15, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
                <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 10, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
                <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 5, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>


             {/* Blog post 1 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
                <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 15, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
                <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 10, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
                <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 5, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

             {/* Blog post 1 */}
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-1.jpg" alt="Blog post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Benefits of Regular Hot Tub Use</h3>
                <p className="text-gray-600 mb-4">Discover how incorporating hot tub sessions into your routine can improve your overall well-being...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 15, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-2.jpg" alt="Blog post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Essential Hot Tub Maintenance Tips</h3>
                <p className="text-gray-600 mb-4">Learn how to keep your hot tub in top condition with these easy-to-follow maintenance tips...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 10, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Blog post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/blog-post-3.jpg" alt="Blog post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Choosing the Right Hot Tub for Your Space</h3>
                <p className="text-gray-600 mb-4">Find the perfect hot tub for your home with our comprehensive guide to sizes, features, and styles...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">June 5, 2023</span>
                  <a href="#" className="text-blue-600 hover:underline">Read More</a>
                </div>
              </div>
            </div>

            {/* Add more blog posts as needed */}
          </div>
        </div>
      </section>
    </div>
  )
}
