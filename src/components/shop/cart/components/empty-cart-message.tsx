import { Button } from '@/components/ui/button'
import { YnsLink } from '@/components/ui/link'

const EmptyCartMessage = () => {
  return (
    <div
      className="py-12 px-4 flex flex-col justify-center items-center text-center"
      data-testid="empty-cart-message"
    >
      <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping and discover
        great products!
      </p>
      <YnsLink href="/shop">
        <Button variant="outline" className="h-10">
          Explore products
        </Button>
      </YnsLink>
    </div>
  )
}

export default EmptyCartMessage
