// import React from 'react'

// export default function TestPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Hero Section */}
//       <section className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/728.jpg')"}}>
//         <div className="absolute inset-0 bg-black opacity-50"></div>
//         <div className="relative z-10 text-center text-white">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Luxury Hot Tubs</h1>
//           <p className="text-xl md:text-2xl">Relax and Unwind in Style</p>
//         </div>
//       </section>

//       {/* Brands Component */}
//       <section className="py-12 bg-gray-100">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-8">Our Trusted Brands</h2>
//           <div className="flex flex-wrap justify-center items-center gap-8">
//             {/* Replace with actual brand logos */}
//             <div className="w-32 h-16 bg-gray-300"></div>
//             <div className="w-32 h-16 bg-gray-300"></div>
//             <div className="w-32 h-16 bg-gray-300"></div>
//             <div className="w-32 h-16 bg-gray-300"></div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Replace with actual product data */}
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="h-64 bg-gray-200"></div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2">Hot Tub Model {item}</h3>
//                   <p className="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Learn More</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Two Column Section */}
//       <section className="py-16 bg-gray-100">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold mb-4">Why Choose Our Hot Tubs?</h2>
//               <p className="text-gray-600 mb-6">Our hot tubs are designed with your comfort and relaxation in mind. With advanced features and premium materials, you'll experience luxury like never before.</p>
//               <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Learn More</button>
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-4">Benefits of Hydrotherapy</h2>
//               <p className="text-gray-600 mb-6">Discover the healing power of water. Our hot tubs provide therapeutic benefits, including stress relief, improved sleep, and muscle relaxation.</p>
//               <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Explore Benefits</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Bento Gallery Grid */}
//       <section className="py-16">
//         <div className="container mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Our Gallery</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {/* Replace with actual images */}
//             {[...Array(8)].map((_, index) => (
//               <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
//                 <img src={`/path-to-image-${index + 1}.jpg`} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
   
//   )
// }
