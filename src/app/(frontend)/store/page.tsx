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
