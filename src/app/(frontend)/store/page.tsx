import getPayload from '@/lib/utils/getPayload'
import { COLLECTION_SLUG_PRODUCT_COLLECTIONS } from '@/payload/collections/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { cache, Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChevronRightIcon,
  SparklesIcon,
  DropletIcon,
  BeakerIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'BonaVista Leisurescapes | Store',
  description: 'Shop online at BonaVista Leisurescapes for premium water care solutions',
}

export default async function StoreHome() {
  const payload = await getPayload()

  const { docs: collections } = await payload.find({
    collection: COLLECTION_SLUG_PRODUCT_COLLECTIONS,
  })

  // const collections = await getCollectionsWithProducts(countryCode)
  // const region = await getRegion(countryCode)

  // if (!collections || !region) {
  //   return null
  // }

  return (
    <Fragment>
      {/* <Hero /> */}
      {/* <div className="py-12">
        {collections.length === 0 && <p>No collections found</p>}
        <ul className="flex flex-col gap-x-6">
          {collections.map((collection) => {
            return (
              <li key={collection.id}>
                <>
                  <Link href={`/collections/${collection.slug}`}>{collection.title}</Link>
                  <p>{collection.description}</p>
                  {collection.products?.map((product) => {
                    if (typeof product === 'object') {
                      return (
                        <div key={product.id}>
                          <p>{product.title}</p>
                          <p>{product.priceJSON}</p>
                        </div>
                      )
                    }
                    return null
                  })}
                </>
              </li>
            )
          })}
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}

      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-800">
        <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container relative px-4 md:px-6 z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
                BonaVista Leisurescapes
              </h1>
              <p className="mx-auto max-w-[700px] text-xl text-blue-100 md:text-2xl">
                Your one-stop shop for premium water care solutions and spa accessories
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/store/water-care">Shop Water Care</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <Link href="/guide/water-care">Water Care Guide</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Featured Product Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Essential Care Kits',
                icon: SparklesIcon,
                color: 'bg-green-100 text-green-600',
              },
              {
                name: 'Luxury Spa Solutions',
                icon: DropletIcon,
                color: 'bg-purple-100 text-purple-600',
              },
              {
                name: 'Eco-Friendly Range',
                icon: BeakerIcon,
                color: 'bg-yellow-100 text-yellow-600',
              },
              {
                name: 'Professional Series',
                icon: SparklesIcon,
                color: 'bg-red-100 text-red-600',
              },
            ].map((product) => (
              <Card
                key={product.name}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center mb-4`}
                  >
                    <product.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Discover our premium selection for ultimate water care.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:text-primary">
                    <Link
                      href={`/products/${product.name.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center"
                    >
                      Shop Now
                      <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Promotion Section */}
      <section className="w-full py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-3xl font-bold">Summer Splash Sale!</h2>
              <p className="text-xl text-blue-100">
                Dive into savings with up to 30% off on selected summer essentials.
              </p>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/summer-sale">Shop Summer Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Water Care Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Hot Tub Chemicals',
              'Swim Spa Solutions',
              'Filtration Systems',
              'Testing Kits',
              'Cleaning Accessories',
              'Eco-Friendly Options',
            ].map((category) => (
              <Card
                key={category}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="h-48 bg-blue-200 relative overflow-hidden">
                  <img
                    src={`/category-${category.toLowerCase().replace(' ', '-')}.jpg`}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore our range of premium {category.toLowerCase()} for crystal clear water.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:text-primary">
                    <Link
                      href={`/category/${category.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center"
                    >
                      View Products
                      <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Limited Time Offer!</h2>
              <p className="text-xl text-blue-100">Get 20% off on all water testing kits</p>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/deals">Shop Deals</Link>
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="BonaVista Leisurescapes" className="h-8 w-auto" />
              <span className="inline-block font-bold">BonaVista</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-background pl-8 md:w-[300px]"
                />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="mr-2">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="mr-6">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">User Account</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main></main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About BonaVista</h3>
              <p className="text-sm">
                Elevating your aquatic experience with premium water care solutions since 1985.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="text-sm">Email: info@bonavista.com</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2024 BonaVista Leisurescapes. All rights reserved.</p>
            <Button variant="link" className="text-gray-300 hover:text-white">
              Get in Touch
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

// import Image from "next/image";
// import type { Metadata } from "next/types";
// import { getTranslations } from "next-intl/server";
// // import * as Commerce from "commerce-kit";
// // import { ProductList } from "@/ui/products/productList";
// // import { CategoryBox } from "@/ui/CategoryBox";
// // import AccessoriesImage from "@/images/accessories.jpg";
// // import ApparelImage from "@/images/apparel.jpg";
// import { YnsLink } from "@/components/ui/link";
// // import { publicUrl } from "@/env.mjs";

// // export const metadata = {
// // 	alternates: { canonical: publicUrl },
// // } satisfies Metadata;

// export default async function Home() {
// 	const t = await getTranslations("/");

// 	// const products = await Commerce.productBrowse({ first: 6 });

// 	return (
// 		<div>
// 			<section className="rounded bg-neutral-100 py-8 sm:py-12">
// 				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
// 					<div className="max-w-md space-y-4">
// 						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
// 							{t("hero.title")}
// 						</h2>
// 						<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
// 						<YnsLink
// 							className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-none focus:ring-1 focus:ring-neutral-950"
// 							href={t("hero.link")}
// 						>
// 							{t("hero.action")}
// 						</YnsLink>
// 					</div>
// 					{/* <Image
// 						alt="Cup of coffee"
// 						loading="eager"
// 						priority={true}
// 						className="rounded"
// 						height={450}
// 						width={450}
// 						src="https://files.stripe.com/links/MDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfaDVvWXowdU9ZbWlobUIyaHpNc1hCeDM200NBzvUjqP"
// 						style={{
// 							objectFit: "cover",
// 						}}
// 						sizes="(max-width: 640px) 70vw, 450px"
// 					/> */}
// 				</div>
// 			</section>
// 			{/* <ProductList products={products} /> */}

// 			<section className="w-full py-8">
// 				HELLO
// 			</section>
// 		</div>
// 	);
// }

// import { Product } from '@medusajs/medusa'
// import { getCollectionsList, getProductsList, getRegion } from '@lib/data'
// import FeaturedProducts from '@modules/home/components/featured-products'
// import Hero from '@modules/home/components/hero'
// import { ProductCollectionWithPreviews } from 'types/global'

// const getCollectionsWithProducts = cache(
//   async (countryCode: string): Promise<ProductCollectionWithPreviews[] | null> => {
//     const { collections } = await getCollectionsList(0, 3)

//     if (!collections) {
//       return null
//     }

//     const collectionIds = collections.map((collection) => collection.id)

//     await Promise.all(
//       collectionIds.map((id) =>
//         getProductsList({
//           queryParams: { collection_id: [id] },
//           countryCode,
//         }),
//       ),
//     ).then((responses) =>
//       responses.forEach(({ response, queryParams }) => {
//         let collection

//         if (collections) {
//           collection = collections.find(
//             (collection) => collection.id === queryParams?.collection_id?.[0],
//           )
//         }

//         if (!collection) {
//           return
//         }

//         collection.products = response.products as unknown as Product[]
//       }),
//     )

//     return collections as unknown as ProductCollectionWithPreviews[]
//   },
// )
