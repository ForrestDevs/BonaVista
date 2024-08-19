interface ProductCardProps {
  title: string
  image: string
  description: string
}

const ProductCard: React.FC<ProductCardProps> = ({ title, image, description }) => (
  <div className="group relative overflow-hidden">
    <img
      src={image}
      alt={title}
      className="w-full h-[600px] object-cover transition duration-300 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <h3 className="text-3xl font-light mb-2">{title}</h3>
        <p className="text-sm opacity-0 group-hover:opacity-100 transition duration-300 delay-100">
          {description}
        </p>
      </div>
    </div>
  </div>
)

const Products: React.FC = () => (
  <section id="products" className="py-20 bg-white">
    <div className="container mx-auto px-8">
      <h2 className="text-4xl font-light text-center mb-16 text-charcoal">Our Luxury Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard
          title="Serenity Hot Tub"
          image="/hottub.jpg"
          description="Immerse yourself in pure relaxation with our state-of-the-art hot tub."
        />
        <ProductCard
          title="Infinity Swim Spa"
          image="/swimspa.jpg"
          description="Experience the perfect blend of exercise and leisure in one luxurious package."
        />
        <ProductCard
          title="Urban Bonfire Outdoor Kitchen"
          image="/urban.webp"
          description="Transform your backyard into a culinary oasis with our custom outdoor kitchens."
        />
        <ProductCard
          title="Dekko Fire Features"
          image="/dekko.jpg"
          description="Light up your backyard with our Dekko fire features."
        />
      </div>
    </div>
  </section>
)

export default Products
