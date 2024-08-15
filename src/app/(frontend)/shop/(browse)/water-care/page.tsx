import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronRightIcon, FilterIcon, SlidersHorizontalIcon } from 'lucide-react'
import { ShopWaterCare } from '@/components/shop/products/product-card'

export default function ShopWaterCarePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="bg-blue-50 py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Shop Water Care Products
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Keep your spa crystal clear with our premium water care solutions
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="sanitizers">Sanitizers</TabsTrigger>
                  <TabsTrigger value="balancers">Balancers</TabsTrigger>
                  <TabsTrigger value="cleaners">Cleaners</TabsTrigger>
                  <TabsTrigger value="test-kits">Test Kits</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
               <ShopWaterCare />
              </TabsContent>

              {/* Repeat similar TabsContent for other categories */}
            </Tabs>

            <div className="mt-12 flex justify-center">
              <Button variant="outline">Load More Products</Button>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-lg mb-4">
              Our Water Care Guide can help you find the right products for your spa.
            </p>
            <Button>
              <Link href="/guide/water-care">View Water Care Guide</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
